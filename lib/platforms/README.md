# Platform Registration System

This directory contains the platform registration system that allows for easy addition of new vehicle platforms without modifying the main platform management code.

## How It Works

The platform system uses a registry pattern where each platform registers itself by name. This eliminates the need for hard-coded switch statements and makes adding new platforms much easier.

### Lazy Initialization

The platform registry uses lazy initialization to solve race condition issues. When you first try to use a platform (create, check, or list), the registry automatically imports all platform files to ensure they're registered. This means:

- No need to manually import platform files
- No race conditions between module loading
- Platforms are only loaded when needed
- Automatic discovery of new platforms

## Adding a New Platform

To add a new platform, follow these steps:

1. **Create a new platform class** that extends the base `Platform` class:

```typescript
import { Platform } from "./baseplatform";
import { Vehicle } from "@/store/vehiclesSlice";
import { platformRegistry } from "./platformRegistry";

export class MyNewPlatform extends Platform {
  constructor(vehicle: Vehicle) {
    super(vehicle);
  }

  connect() {
    console.log("[platform MyNewPlatform] connect", this.currentVehicle.name);
    // Your connection logic here
  }

  disconnect() {
    console.log("[platform MyNewPlatform] disconnect", this.currentVehicle.name);
    // Your disconnection logic here
  }

  handleNotificationResponse(response: any) {
    // Handle notification responses
  }

  handleNotificationIncoming(notification: any) {
    // Handle incoming notifications
  }

  handleNotificationRegistration(pushTokenString: string) {
    // Handle push token registration
  }
}

// Register this platform with the registry
platformRegistry.register("mynewplatform", MyNewPlatform);
```

2. **That's it!** The platform will be automatically discovered and available when needed.

3. **Use the platform** by setting the vehicle's `platform` property to your platform name (e.g., `"mynewplatform"`).

## Benefits

- **No hard-coded switch statements**: Adding a new platform doesn't require modifying existing code
- **No race conditions**: Lazy initialization ensures platforms are available when needed
- **Easy to test**: Each platform is self-contained and can be tested independently
- **Better organization**: Each platform is responsible for its own registration
- **Runtime discovery**: The system can discover available platforms at runtime
- **Type safety**: Full TypeScript support with proper typing
- **Automatic loading**: No need to manually import platform files

## Available Methods

The `platformRegistry` provides several useful methods:

- `register(name, constructor)`: Register a new platform
- `get(name)`: Get a platform constructor by name (triggers lazy init)
- `has(name)`: Check if a platform is registered (triggers lazy init)
- `createPlatform(name, vehicle)`: Create a platform instance (triggers lazy init)
- `getRegisteredPlatforms()`: Get all registered platform names (triggers lazy init)
- `getPlatformInfo()`: Get detailed information about all platforms (triggers lazy init)
- `forceInitialize()`: Force initialization (useful for testing)
- `clear()`: Clear all registered platforms (useful for testing)

## Example Usage

```typescript
// Check if a platform is available (triggers lazy init)
if (platformRegistry.has("ovmsv2api")) {
  console.log("OVMS v2 API platform is available");
}

// Get all available platforms (triggers lazy init)
const platforms = platformRegistry.getRegisteredPlatforms();
console.log("Available platforms:", platforms);

// Get platform information (triggers lazy init)
const info = platformRegistry.getPlatformInfo();
console.log("Platform info:", info);

// Force initialization (useful for testing)
platformRegistry.forceInitialize();
```

## Debugging

The platform registry includes comprehensive logging to help debug issues:

- Registration events are logged with platform names and constructor names
- Platform lookup attempts are logged with success/failure status
- Initialization events are logged with available platforms
- Error conditions are logged with details

## Current Platforms

- `ovmsv2api`: OVMS v2 API implementation
- `teslafleetapi`: Tesla Fleet API implementation