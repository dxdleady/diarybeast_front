# State Management

<cite>
**Referenced Files in This Document**   
- [petStore.ts](file://lib/stores/petStore.ts)
- [musicPlayerStore.ts](file://lib/stores/musicPlayerStore.ts)
- [GamificationContext.tsx](file://lib/contexts/GamificationContext.tsx)
- [Pet.tsx](file://components/Pet.tsx)
- [PawPlayer.tsx](file://components/GlobalMusicPlayer/PawPlayer.tsx)
- [GlobalMusicProvider.tsx](file://components/GlobalMusicPlayer/GlobalMusicProvider.tsx)
- [providers.tsx](file://app/providers.tsx)
- [useLifeCheck.ts](file://hooks/useLifeCheck.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [State Management Architecture](#state-management-architecture)
3. [Persistent State with Zustand](#persistent-state-with-zustand)
   - [Pet Store](#pet-store)
   - [Music Player Store](#music-player-store)
4. [Transient State with React Context](#transient-state-with-react-context)
   - [Gamification Context](#gamification-context)
5. [Custom Hooks for Complex Logic](#custom-hooks-for-complex-logic)
   - [useLifeCheck Hook](#uselifecheck-hook)
6. [State Synchronization and Integration](#state-synchronization-and-integration)
7. [Persistence and Rehydration](#persistence-and-rehydration)
8. [Performance Considerations](#performance-considerations)

## Introduction
DiaryBeast implements a hybrid state management system that combines Zustand for persistent application state and React Context for transient UI state. This architecture supports the core gameplay mechanics of pet care, music integration, and gamification features. The system is designed to handle both blockchain-integrated data and real-time user interactions while maintaining optimal performance and reactivity.

## State Management Architecture

```mermaid
graph TD
A[State Management System] --> B[Zustand Stores]
A --> C[React Context]
A --> D[Custom Hooks]
B --> E[petStore]
B --> F[musicPlayerStore]
C --> G[GamificationContext]
D --> H[useLifeCheck]
E --> I[Pet Health & Happiness]
E --> J[Inventory & Actions]
E --> K[Blockchain Integration]
F --> L[Music Playback]
F --> M[Track Queue]
F --> N[Mubert Integration]
G --> O[Modal States]
G --> P[Animation Triggers]
H --> Q[Life Check Logic]
H --> R[Notification System]
```

**Diagram sources**
- [petStore.ts](file://lib/stores/petStore.ts)
- [musicPlayerStore.ts](file://lib/stores/musicPlayerStore.ts)
- [GamificationContext.tsx](file://lib/contexts/GamificationContext.tsx)
- [useLifeCheck.ts](file://hooks/useLifeCheck.ts)

**Section sources**
- [petStore.ts](file://lib/stores/petStore.ts)
- [musicPlayerStore.ts](file://lib/stores/musicPlayerStore.ts)
- [GamificationContext.tsx](file://lib/contexts/GamificationContext.tsx)

## Persistent State with Zustand

### Pet Store

The petStore manages the persistent state of the user's virtual pet, including health, happiness, animations, and inventory. It integrates with blockchain data through the user's wallet address and maintains state across sessions.

```mermaid
classDiagram
class PetStore {
+number lives
+number happiness
+PetState state
+Date | null lastFeedTime
+Date | null lastPlayTime
+boolean canFeed
+boolean canPlay
+number feedCooldownRemaining
+number playCooldownRemaining
+initializePet(data) void
+setState(newState) void
+feed(userAddress, foodId) Promise~void~
+play(userAddress) Promise~void~
+updateHappiness(delta) void
+updateLives(newLives) void
+updateCooldowns() void
}
class PetState {
<<enumeration>>
idle
happy
sad
critical
eating
playing
sleeping
}
PetStore --> PetState : "uses"
```

**Diagram sources**
- [petStore.ts](file://lib/stores/petStore.ts#L13-L40)

**Section sources**
- [petStore.ts](file://lib/stores/petStore.ts#L42-L220)
- [Pet.tsx](file://components/Pet.tsx#L24-L386)

### Music Player Store

The musicPlayerStore manages the playback state, track queue, and Mubert integration for the application's music features. It persists user preferences and maintains the current playback state.

```mermaid
classDiagram
class MusicPlayerStore {
+Genre currentGenre
+boolean isPlaying
+number volume
+boolean isLoading
+getCurrentTrack() Track | null
+setGenre(genre) void
+play() void
+pause() void
+togglePlay() void
+setVolume(volume) void
+reset() void
}
class Genre {
<<enumeration>>
ambient
lofi
nature
}
class Track {
+string id
+string title
+Genre genre
+string streamUrl
+string | undefined artist
+number | undefined duration
}
MusicPlayerStore --> Genre : "uses"
MusicPlayerStore --> Track : "manages"
```

**Diagram sources**
- [musicPlayerStore.ts](file://lib/stores/musicPlayerStore.ts#L39-L53)

**Section sources**
- [musicPlayerStore.ts](file://lib/stores/musicPlayerStore.ts#L56-L161)
- [PawPlayer.tsx](file://components/GlobalMusicPlayer/PawPlayer.tsx)
- [GlobalMusicProvider.tsx](file://components/GlobalMusicPlayer/GlobalMusicProvider.tsx)

## Transient State with React Context

### Gamification Context

The GamificationContext manages transient UI states such as modals and animations that do not require persistence across sessions. It provides a simple API for showing and hiding gamification elements.

```mermaid
classDiagram
class GamificationContext {
+boolean showGamificationModal
+openGamificationModal() void
+closeGamificationModal() void
}
class GamificationProvider {
+children ReactNode
}
class useGamification {
+returns GamificationContextType
}
GamificationProvider --> GamificationContext : "provides"
useGamification --> GamificationContext : "consumes"
```

**Diagram sources**
- [GamificationContext.tsx](file://lib/contexts/GamificationContext.tsx#L4-L8)

**Section sources**
- [GamificationContext.tsx](file://lib/contexts/GamificationContext.tsx#L10-L37)
- [providers.tsx](file://app/providers.tsx#L1-L55)

## Custom Hooks for Complex Logic

### useLifeCheck Hook

The useLifeCheck custom hook abstracts complex state logic for checking pet lives and handling notifications. It manages automatic checks, debouncing, and notification state.

```mermaid
sequenceDiagram
participant Component as "Component"
participant Hook as "useLifeCheck"
participant API as "API /api/life/check"
Component->>Hook : Mount or Route Change
Hook->>Hook : Debounce Check (30s)
Hook->>API : POST /api/life/check
API-->>Hook : Response with life status
alt Should Notify
Hook->>Hook : Set Notification State
Hook->>Component : Expose notification
else No Notification
Hook->>Component : No notification
end
loop Every Minute
Hook->>Hook : Check Midnight Crossing
Hook->>API : POST /api/life/check if midnight crossed
API-->>Hook : Response
end
```

**Diagram sources**
- [useLifeCheck.ts](file://hooks/useLifeCheck.ts#L1-L153)

**Section sources**
- [useLifeCheck.ts](file://hooks/useLifeCheck.ts#L1-L153)

## State Synchronization and Integration

The state management system ensures synchronization between components and stores through various mechanisms:

```mermaid
flowchart TD
A[Server Data] --> B[Pet Component]
B --> C[petStore.initializePet]
C --> D[Store State]
D --> E[Pet Component]
E --> F[getAnimationState]
F --> G[Render Animation]
H[User Action] --> I[Pet Component]
I --> J[petStore.feed/play]
J --> K[API Call]
K --> L[Update Store]
L --> M[Re-render]
N[Music Player] --> O[User Click]
O --> P[musicPlayerStore.togglePlay]
P --> Q[GlobalMusicProvider]
Q --> R[Audio Element]
R --> S[Play/Pause]
```

**Diagram sources**
- [Pet.tsx](file://components/Pet.tsx#L24-L386)
- [GlobalMusicProvider.tsx](file://components/GlobalMusicPlayer/GlobalMusicProvider.tsx)
- [PawPlayer.tsx](file://components/GlobalMusicPlayer/PawPlayer.tsx)

**Section sources**
- [Pet.tsx](file://components/Pet.tsx#L24-L386)
- [GlobalMusicProvider.tsx](file://components/GlobalMusicPlayer/GlobalMusicProvider.tsx)
- [PawPlayer.tsx](file://components/GlobalMusicPlayer/PawPlayer.tsx)

## Persistence and Rehydration

The state management system implements persistence strategies to maintain state across page reloads:

- **petStore**: Persists pet state, cooldowns, and preferences through server synchronization
- **musicPlayerStore**: Uses localStorage to persist genre and volume preferences
- **Rehydration**: On component mount, stores are initialized with server data to ensure consistency

The system handles rehydration by:
1. Initializing stores with server data on component mount
2. Loading user preferences from localStorage
3. Setting up interval updates for time-based state changes
4. Synchronizing with blockchain data via wallet address

**Section sources**
- [petStore.ts](file://lib/stores/petStore.ts#L42-L220)
- [musicPlayerStore.ts](file://lib/stores/musicPlayerStore.ts#L56-L161)
- [Pet.tsx](file://components/Pet.tsx#L24-L386)

## Performance Considerations

The state management system addresses performance through several strategies:

```mermaid
flowchart TD
A[Performance Considerations] --> B[Optimistic Updates]
A --> C[Debounced API Calls]
A --> D[Selective Re-renders]
A --> E[Interval Management]
A --> F[Error Handling]
B --> G[Immediate UI Feedback]
B --> H[Rollback on Failure]
C --> I[Prevent Spam]
C --> J[30s Minimum Interval]
D --> K[Only Update Changed State]
D --> L[Use Zustand Selectors]
E --> M[Update Cooldowns Every Minute]
E --> N[Clear Interval on Unmount]
F --> O[Graceful Error Recovery]
F --> P[User Feedback]
```

**Diagram sources**
- [petStore.ts](file://lib/stores/petStore.ts#L42-L220)
- [useLifeCheck.ts](file://hooks/useLifeCheck.ts#L1-L153)

**Section sources**
- [petStore.ts](file://lib/stores/petStore.ts#L42-L220)
- [useLifeCheck.ts](file://hooks/useLifeCheck.ts#L1-L153)
- [Pet.tsx](file://components/Pet.tsx#L24-L386)