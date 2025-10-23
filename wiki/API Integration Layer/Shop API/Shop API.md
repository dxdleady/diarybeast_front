# Shop API

<cite>
**Referenced Files in This Document**   
- [app/api/shop/items/route.ts](file://app/api/shop/items/route.ts)
- [app/api/shop/purchase/route.ts](file://app/api/shop/purchase/route.ts)
- [app/api/shop/purchases/route.ts](file://app/api/shop/purchases/route.ts)
- [lib/gamification/itemsConfig.ts](file://lib/gamification/itemsConfig.ts)
- [lib/blockchain.ts](file://lib/blockchain.ts)
- [app/shop/page.tsx](file://app/shop/page.tsx)
- [prisma/seed.ts](file://prisma/seed.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [API Endpoints](#api-endpoints)
3. [Item Configuration](#item-configuration)
4. [Purchase Validation Flow](#purchase-validation-flow)
5. [Request Examples](#request-examples)
6. [Error Responses](#error-responses)
7. [Idempotency and Audit Logging](#idempotency-and-audit-logging)
8. [Integration with Blockchain](#integration-with-blockchain)

## Introduction
The Shop API enables users to interact with virtual items in the DiaryBeast ecosystem. It supports retrieving available items, executing purchases using DIARY tokens, and fetching purchase history. The system integrates with on-chain token balances and maintains state through Prisma-managed database persistence. This document details the three core endpoints: retrieving shop items, processing purchases, and accessing user purchase history.

## API Endpoints

### GET /api/shop/items
Retrieves all available shop items sorted by display priority.

```mermaid
flowchart TD
A[Client Request] --> B{Validate Request}
B --> C[Query Prisma for Available Items]
C --> D[Order by Sort Priority]
D --> E[Return Items List]
```

**Section sources**
- [app/api/shop/items/route.ts](file://app/api/shop/items/route.ts#L1-L18)

### POST /api/shop/purchase
Processes a purchase of virtual items using DIARY tokens.

```mermaid
flowchart TD
A[Client Request] --> B{Validate Required Fields}
B --> C[Find User by Wallet Address]
C --> D{Item Type?}
D --> |Food| E[Validate Food Item]
D --> |Consumable| F[Validate Consumable Item]
D --> |Regular| G[Validate Shop Item]
E --> H[Check Token Balance]
F --> H
G --> H
H --> I{Sufficient Balance?}
I --> |No| J[Return Insufficient Funds]
I --> |Yes| K[Burn Tokens on Chain]
K --> L[Update User Inventory/Balance]
L --> M[Create Purchase Record]
M --> N[Return Success Response]
```

**Section sources**
- [app/api/shop/purchase/route.ts](file://app/api/shop/purchase/route.ts#L1-L184)

### GET /api/shop/purchases
Fetches a user's purchase history based on wallet address.

```mermaid
flowchart TD
A[Client Request] --> B{Extract userAddress Parameter}
B --> C{Valid Address?}
C --> |No| D[Return 400 Error]
C --> |Yes| E[Query User with Purchases]
E --> F{User Found?}
F --> |No| G[Return Empty Purchases]
F --> |Yes| H[Return Purchase History]
```

**Section sources**
- [app/api/shop/purchases/route.ts](file://app/api/shop/purchases/route.ts#L1-L32)

## Item Configuration

### Food Items
Configured in `itemsConfig.ts`, food items are stackable consumables with specific gameplay effects.

```mermaid
classDiagram
class FoodItem {
+string id
+string name
+string description
+number price
+number livesGain
+number happinessGain
+number cooldown
+string emoji
+string rarity
+boolean stackable
+number maxStack
}
FoodItem <|-- BasicKibble : "implements"
FoodItem <|-- PremiumMeat : "implements"
FoodItem <|-- VeggieBowl : "implements"
FoodItem <|-- EnergyDrink : "implements"
```

**Diagram sources**
- [lib/gamification/itemsConfig.ts](file://lib/gamification/itemsConfig.ts#L10-L50)

### Consumable Items
One-time use items providing various gameplay benefits.

```mermaid
classDiagram
class ConsumableItem {
+string id
+string name
+string description
+number price
+string effect
+number value
+string emoji
+string category
}
ConsumableItem <|-- TimeSkip : "implements"
ConsumableItem <|-- HealthPotion : "implements"
ConsumableItem <|-- HappyPill : "implements"
```

**Diagram sources**
- [lib/gamification/itemsConfig.ts](file://lib/gamification/itemsConfig.ts#L60-L90)

## Purchase Validation Flow

### Complete Purchase Sequence
The purchase process follows a strict validation and execution sequence to ensure data consistency.

```mermaid
sequenceDiagram
participant Client
participant API as Shop API
participant Items as itemsConfig.ts
participant Blockchain
participant Database as Prisma DB
Client->>API : POST /purchase with itemId, userAddress
API->>API : Validate required fields
API->>Database : Find user by walletAddress
API->>Items : Get item configuration
API->>Database : Check current balance
alt Insufficient balance
API-->>Client : 400 Error
else Sufficient balance
API->>Blockchain : burnTokens(userAddress, amount)
API->>Database : Update user inventory/balance
API->>Database : Create purchase record
API-->>Client : Success response with txHash
end
```

**Diagram sources**
- [app/api/shop/purchase/route.ts](file://app/api/shop/purchase/route.ts#L1-L184)
- [lib/gamification/itemsConfig.ts](file://lib/gamification/itemsConfig.ts#L1-L234)
- [lib/blockchain.ts](file://lib/blockchain.ts#L1-L112)

### Database Schema
The Prisma schema defines the structure for shop-related data persistence.

```mermaid
erDiagram
USER {
string id PK
string walletAddress UK
int coinsBalance
json inventory
string activeBackground
string activeAccessory
}
SHOPITEM {
string id PK
string type
string name
string description
int price
string imageUrl
boolean available
int sortOrder
}
PURCHASE {
string id PK
string userId FK
string itemType
string itemId
int price
string txHash
datetime purchasedAt
}
USER ||--o{ PURCHASE : "has"
SHOPITEM ||--o{ PURCHASE : "purchased"
```

**Diagram sources**
- [prisma/seed.ts](file://prisma/seed.ts#L1-L66)
- [TECHNICAL_DOCUMENTATION.md](file://TECHNICAL_DOCUMENTATION.md#L139-L254)

## Request Examples

### Retrieve Available Items
Example request to get all available shop items.

```mermaid
sequenceDiagram
participant Client
participant API
Client->>API : GET /api/shop/items
API->>Database : prisma.shopItem.findMany()
Database-->>API : Return available items
API-->>Client : 200 OK with items array
```

**Section sources**
- [app/shop/page.tsx](file://app/shop/page.tsx#L36-L49)

### Execute Purchase
Example flow for purchasing a food item.

```mermaid
sequenceDiagram
participant Client
participant API
participant Blockchain
participant Database
Client->>API : POST /api/shop/purchase
API->>Database : Find user
API->>ItemsConfig : Validate food item
API->>Database : Check balance and inventory
API->>Blockchain : burnTokens()
API->>Database : Update inventory and balance
API->>Database : Create purchase record
API-->>Client : Success response with updated state
```

**Section sources**
- [app/shop/page.tsx](file://app/shop/page.tsx#L106-L142)

### Fetch Purchase History
Example request to retrieve a user's purchase history.

```mermaid
sequenceDiagram
participant Client
participant API
participant Database
Client->>API : GET /api/shop/purchases?userAddress=0x...
API->>Database : Find user with purchases
Database-->>API : Return user with purchases
API-->>Client : 200 OK with purchases array
```

**Section sources**
- [app/shop/page.tsx](file://app/shop/page.tsx#L56-L56)

## Error Responses

### Common Error Scenarios
The API returns specific error responses for various failure conditions.

```mermaid
flowchart TD
A[Error Occurs] --> B{Error Type}
B --> |Validation| C[400 Bad Request]
B --> |Not Found| D[404 Not Found]
B --> |Conflict| E[409 Conflict]
B --> |Server| F[500 Internal Error]
C --> G["{ error: 'Missing required fields' }"]
D --> H["{ error: 'User not found' }"]
E --> I["{ error: 'Already owned' }"]
F --> J["{ error: 'Purchase failed' }"]
```

**Section sources**
- [app/api/shop/purchase/route.ts](file://app/api/shop/purchase/route.ts#L5-L184)

### Specific Error Messages
Detailed error responses for purchase validation failures.

| Error Condition | HTTP Status | Response Body |
|----------------|------------|---------------|
| Missing required fields | 400 | `{ error: 'Missing required fields' }` |
| User not found | 404 | `{ error: 'User not found' }` |
| Food item not found | 404 | `{ error: 'Food item not found' }` |
| Insufficient balance | 400 | `{ error: 'Not enough DIARY. Need X, have Y' }` |
| Exceeds max stack | 400 | `{ error: 'Cannot exceed max stack of Z' }` |
| Item already owned | 409 | `{ error: 'Already owned' }` |
| Purchase failed | 500 | `{ error: 'Purchase failed' }` |

**Section sources**
- [app/api/shop/purchase/route.ts](file://app/api/shop/purchase/route.ts#L5-L184)

## Idempotency and Audit Logging

### Idempotency Implementation
The purchase endpoint ensures idempotent operations through careful state management.

```mermaid
flowchart TD
A[Receive Purchase Request] --> B{Item Type?}
B --> |Food/Consumable| C[Allow Multiple Purchases]
B --> |Regular Item| D[Check Existing Purchase]
D --> E{Already Purchased?}
E --> |Yes| F[Return 409 Conflict]
E --> |No| G[Process Purchase]
C --> H[Process Purchase]
H --> I[Create Audit Log]
```

**Section sources**
- [app/api/shop/purchase/route.ts](file://app/api/shop/purchase/route.ts#L136-L145)

### Audit Logging
Comprehensive logging ensures traceability of all purchase operations.

```mermaid
sequenceDiagram
participant API
participant Console
participant Database
API->>Console : console.error('Purchase error : ', error)
API->>Database : prisma.purchase.create()
API->>Console : console.error('Token burn failed : ', error)
API->>Database : Update user record
API->>Console : Log success with txHash
```

**Section sources**
- [app/api/shop/purchase/route.ts](file://app/api/shop/purchase/route.ts#L5-L184)

## Integration with Blockchain

### Token Balance Verification
The system synchronizes token balances between on-chain state and database records.

```mermaid
sequenceDiagram
participant Frontend
participant API
participant Blockchain
participant Database
Frontend->>API : Request purchase
API->>Blockchain : getTokenBalance(userAddress)
API->>Database : Compare with stored balance
alt Balance mismatch
API->>Database : syncUserBalance()
end
API->>Blockchain : burnTokens(userAddress, amount)
API->>Database : Update user coinsBalance
```

**Section sources**
- [lib/blockchain.ts](file://lib/blockchain.ts#L1-L112)
- [app/api/shop/purchase/route.ts](file://app/api/shop/purchase/route.ts#L1-L184)

### Blockchain Interaction
The `blockchain.ts` module handles all interactions with the DIARY token contract.

```mermaid
classDiagram
class blockchain {
+mintTokens(userAddress, amount)
+burnTokens(userAddress, amount)
+getTokenBalance(userAddress)
+syncUserBalance(userAddress, prisma)
}
blockchain --> WalletClient : "uses"
blockchain --> PublicClient : "uses"
blockchain --> DIARY_TOKEN_ABI : "uses"
```

**Diagram sources**
- [lib/blockchain.ts](file://lib/blockchain.ts#L1-L112)