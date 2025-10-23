# Key Management

<cite>
**Referenced Files in This Document**   
- [EncryptionKeyContext.tsx](file://lib/EncryptionKeyContext.tsx)
- [encryption.ts](file://lib/encryption.ts)
- [providers.tsx](file://app/providers.tsx)
- [EntryViewer.tsx](file://components/EntryViewer.tsx)
- [page.tsx](file://app/diary/page.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Encryption Key Context](#encryption-key-context)
3. [Key Derivation Process](#key-derivation-process)
4. [Provider Implementation](#provider-implementation)
5. [Hook Usage](#hook-usage)
6. [Component Integration](#component-integration)
7. [Security Considerations](#security-considerations)
8. [Common Issues](#common-issues)

## Introduction
The encryption key management system in DiaryBeast provides a secure mechanism for handling user journal entries through client-side encryption. This system ensures that only the user can access their content by deriving encryption keys from their wallet address. The implementation uses React Context to make the encryption key available throughout the application while maintaining security and performance.

## Encryption Key Context

The `EncryptionKeyContext` provides a React context wrapper for accessing the derived encryption key. It defines the context type with two properties: `encryptionKey` which can be a string or null, and `isLoading` which indicates the loading state. The context is initialized with an undefined value to ensure proper error handling when used outside the provider.

```mermaid
classDiagram
class EncryptionKeyContextType {
+encryptionKey : string | null
+isLoading : boolean
}
class EncryptionKeyProvider {
+children : ReactNode
}
class useEncryptionKey {
+returns : EncryptionKeyContextType
}
EncryptionKeyProvider --> EncryptionKeyContextType : "provides"
useEncryptionKey --> EncryptionKeyContextType : "consumes"
```

**Diagram sources**
- [EncryptionKeyContext.tsx](file://lib/EncryptionKeyContext.tsx#L6-L9)
- [EncryptionKeyContext.tsx](file://lib/EncryptionKeyContext.tsx#L20-L35)
- [EncryptionKeyContext.tsx](file://lib/EncryptionKeyContext.tsx#L37-L43)

**Section sources**
- [EncryptionKeyContext.tsx](file://lib/EncryptionKeyContext.tsx#L6-L13)

## Key Derivation Process

The key derivation process uses the wallet address combined with a salt value to generate a deterministic encryption key. This approach ensures that the same key is generated across different devices while maintaining security. The `getEncryptionKey` function takes the wallet address as input, converts it to lowercase, combines it with a predefined salt, and applies the keccak256 hash function to produce the final key.

```mermaid
flowchart TD
Start([Wallet Address]) --> Normalize["Convert to lowercase"]
Normalize --> Combine["Combine with salt 'DiaryBeast_v1_encryption'"]
Combine --> Hash["Apply keccak256 hash"]
Hash --> End([Encryption Key])
```

**Diagram sources**
- [encryption.ts](file://lib/encryption.ts#L8-L12)

**Section sources**
- [encryption.ts](file://lib/encryption.ts#L8-L12)

## Provider Implementation

The `EncryptionKeyProvider` component uses the `useAccount` hook from Wagmi to detect wallet connection status and automatically derive the encryption key when an address is available. The provider leverages React's `useMemo` hook to prevent unnecessary recalculations of the encryption key, only recomputing when the address or connection status changes. When no wallet is connected, the encryption key is set to null.

```mermaid
sequenceDiagram
participant Provider as "EncryptionKeyProvider"
participant Wagmi as "useAccount"
participant KeyDerivation as "getEncryptionKey"
Provider->>Wagmi : Get address and isConnected
Wagmi-->>Provider : Return account status
Provider->>Provider : Check if address and isConnected
alt Wallet Connected
Provider->>KeyDerivation : Call with address
KeyDerivation-->>Provider : Return encryption key
Provider->>Context : Provide key
else Wallet Disconnected
Provider->>Context : Provide null key
end
```

**Diagram sources**
- [EncryptionKeyContext.tsx](file://lib/EncryptionKeyContext.tsx#L20-L35)
- [encryption.ts](file://lib/encryption.ts#L8-L12)

**Section sources**
- [EncryptionKeyContext.tsx](file://lib/EncryptionKeyContext.tsx#L20-L35)

## Hook Usage

The `useEncryptionKey` hook enables components to securely access the encryption key or null if disconnected. It uses React's `useContext` to consume the `EncryptionKeyContext` and includes a safety check to ensure it is used within the `EncryptionKeyProvider`. If used outside the provider, it throws an error to prevent undefined behavior.

```mermaid
flowchart TD
Start([Component]) --> Hook["useEncryptionKey()"]
Hook --> Context["useContext(EncryptionKeyContext)"]
Context --> Check["Check if undefined"]
Check --> |Defined| Return["Return context"]
Check --> |Undefined| Error["Throw Error"]
Return --> End([encryptionKey, isLoading])
Error --> End
```

**Diagram sources**
- [EncryptionKeyContext.tsx](file://lib/EncryptionKeyContext.tsx#L37-L43)

**Section sources**
- [EncryptionKeyContext.tsx](file://lib/EncryptionKeyContext.tsx#L37-L43)

## Component Integration

The encryption key system is integrated into various components throughout the application. The `EncryptionKeyProvider` is wrapped around the application in `providers.tsx`, making the context available to all child components. Components like `TextEditor` and `EntryViewer` use the `useEncryptionKey` hook to access the encryption key for encrypting and decrypting journal entries.

```mermaid
graph TB
A[Providers] --> B[EncryptionKeyProvider]
B --> C[MusicProvider]
C --> D[GlobalMusicProvider]
D --> E[GamificationProvider]
E --> F[LifeCheckWrapper]
F --> G[Diary Component]
G --> H[TextEditor]
G --> I[EntryViewer]
H --> J[useEncryptionKey]
I --> K[useEncryptionKey]
```

**Diagram sources**
- [providers.tsx](file://app/providers.tsx#L31-L54)
- [page.tsx](file://app/diary/page.tsx#L16-L260)
- [EntryViewer.tsx](file://components/EntryViewer.tsx#L19-L123)

**Section sources**
- [providers.tsx](file://app/providers.tsx#L31-L54)
- [page.tsx](file://app/diary/page.tsx#L16-L260)
- [EntryViewer.tsx](file://components/EntryViewer.tsx#L19-L123)

## Security Considerations

The encryption key management system stores keys in memory rather than persisting them to storage, reducing the risk of exposure. Sensitive operations remain isolated to the client side, ensuring that encryption and decryption never occur on the server. The deterministic key derivation allows consistent key generation across devices without requiring additional signatures. However, users must be aware that losing access to their wallet means losing access to their encrypted entries.

**Section sources**
- [EncryptionKeyContext.tsx](file://lib/EncryptionKeyContext.tsx#L15-L18)
- [encryption.ts](file://lib/encryption.ts#L14-L21)

## Common Issues

Common issues include handling disconnected wallet states and ensuring proper context initialization. When a wallet is disconnected, components must gracefully handle the null encryption key state. The `useMemo` optimization prevents unnecessary key recalculations during re-renders. Proper initialization requires wrapping components with `EncryptionKeyProvider` before using `useEncryptionKey`, as attempting to use the hook outside the provider context will throw an error.

**Section sources**
- [EncryptionKeyContext.tsx](file://lib/EncryptionKeyContext.tsx#L23-L26)
- [EncryptionKeyContext.tsx](file://lib/EncryptionKeyContext.tsx#L38-L42)