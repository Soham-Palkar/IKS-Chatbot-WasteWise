# WasteWise — API & Service Contract Documentation

## 1. Overview

WasteWise communicates with two external intelligence pipelines:
1. **Dedicated Computer Vision Endpoint (`POST /predict`)**
2. **Google Gemini Generative AI API (`gemini-2.5-flash`)**

---

## 2. Computer Vision Endpoint (`POST /predict`)

### Request
- **Method**: `POST`
- **Path**: `/predict`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `image`: Binary image file (JPEG, PNG, WebP)

```http
POST /predict HTTP/1.1
Host: localhost:3000
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="image"; filename="bottle.jpg"
Content-Type: image/jpeg

[binary image data]
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

### Expected Response
- **Status**: `200 OK`
- **Content-Type**: `application/json`

```json
{
  "object": "Plastic Bottle",
  "category": "dry",
  "confidence": 0.94,
  "reason": "Clear polyethylene terephthalate container with recyclable PET 1 structure. Empty and rinse before placing in dry bin."
}
```

### Response Fields

| Field | Type | Description |
| :--- | :--- | :--- |
| `object` | `string` | Human-readable name of the identified waste item |
| `category` | `string` | Categorization: `"wet"`, `"dry"`, `"ewaste"`, `"hazardous"` |
| `confidence` | `number` | Float between `0.0` and `1.0` indicating classification confidence |
| `reason` | `string` | Brief explanation of material composition and segregation rationale |

---

## 3. Gemini Multimodal Vision Fallback

When `POST /predict` is unreachable (network timeout or offline server), WasteWise automatically routes the visual analysis through Google Gemini Multimodal Vision:

```typescript
const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: [
    {
      role: 'user',
      parts: [
        {
          inlineData: {
            mimeType: file.type || 'image/jpeg',
            data: base64Data,
          },
        },
        {
          text: 'Analyze this image of a waste item for waste segregation. Return JSON adhering to schema: { object, category, confidence, reason, resinCode }',
        },
      ],
    },
  ],
});
```

---

## 4. Gemini Chat Conversational Service

### Configuration
- **Model**: `gemini-2.5-flash`
- **Temperature**: `0.2` (low temperature for deterministic classification and minimal hallucination)
- **Max Output Tokens**: `600`
- **System Instruction**: Enforces the WasteWise persona, municipal bin alignment, safety guidelines, and the strict out-of-scope guardrail.

### Out-of-Scope Contract
When queries violate the waste management domain boundary, the service responds with the standard guardrail text:

```
I'm WasteWise, an AI assistant focused on waste segregation and sustainable waste practices. Ask me about identifying, segregating, recycling, composting, or responsibly managing waste.
```

---

## 5. Security & Isolation
- User API keys are held in `window.sessionStorage` under the key `wastewise_gemini_api_key`.
- API keys are passed directly to the official `@google/genai` client instance in memory.
- No intermediary proxy server logs, stores, or transmits user API credentials.
