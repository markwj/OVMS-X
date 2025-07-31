// Platform registry for dynamic platform registration

import { Vehicle } from "@/store/vehiclesSlice";
import { Platform } from "./baseplatform";

// Type for platform constructor function
export type PlatformConstructor = new (vehicle: Vehicle) => Platform;

// Registry to store platform constructors by name
class PlatformRegistry {
  private platforms: Map<string, PlatformConstructor> = new Map();
  private initialized: boolean = false;

  // Initialize the registry by importing all platform files
  private initialize(): void {
    if (this.initialized) return;
    
    if (__DEV__) {
      console.log("[platformRegistry] Initializing registry...");
    }
    
    try {
      // Import all platform implementations to ensure they register themselves
      require("./ovmsv2api");
      require("./teslafleetapi");
      
      this.initialized = true;
      if (__DEV__) {
        console.log("[platformRegistry] Registry initialized successfully");
        console.log("[platformRegistry] Available platforms:", this.getRegisteredPlatforms());
      }
    } catch (error) {
      console.error("[platformRegistry] Error initializing registry:", error);
    }
  }

  // Register a platform constructor by name
  register(name: string, constructor: PlatformConstructor): void {
    if (__DEV__) {
      console.log("[platformRegistry] Registering platform:", name, "Constructor:", constructor.name);
    }
    this.platforms.set(name, constructor);
  }

  // Get a platform constructor by name
  get(name: string): PlatformConstructor | undefined {
    this.initialize(); // Ensure platforms are loaded
    const constructor = this.platforms.get(name);
    if (__DEV__) {
      console.log("[platformRegistry] Getting platform:", name, "Found:", !!constructor);
    }
    return constructor;
  }

  // Check if a platform is registered
  has(name: string): boolean {
    this.initialize(); // Ensure platforms are loaded
    const hasPlatform = this.platforms.has(name);
    if (__DEV__) {
      console.log("[platformRegistry] Checking platform:", name, "Has:", hasPlatform);
    }
    return hasPlatform;
  }

  // Get all registered platform names
  getRegisteredPlatforms(): string[] {
    this.initialize(); // Ensure platforms are loaded
    const platforms = Array.from(this.platforms.keys());
    if (__DEV__) {
      console.log("[platformRegistry] All registered platforms:", platforms);
    }
    return platforms;
  }

  // Create a platform instance by name
  createPlatform(name: string, vehicle: Vehicle): Platform | null {
    if (__DEV__) {
      console.log("[platformRegistry] Creating platform:", name);
    }
    this.initialize(); // Ensure platforms are loaded
    const constructor = this.get(name);
    if (constructor) {
      const platform = new constructor(vehicle);
      if (__DEV__) {
        console.log("[platformRegistry] Successfully created platform:", name, "Instance:", platform.constructor.name);
      }
      return platform;
    }
    console.warn("[platformRegistry] Platform not found:", name);
    if (__DEV__) {
      console.log("[platformRegistry] Available platforms:", this.getRegisteredPlatforms());
    }
    return null;
  }

  // Get information about all registered platforms
  getPlatformInfo(): { name: string; constructor: string }[] {
    this.initialize(); // Ensure platforms are loaded
    return Array.from(this.platforms.entries()).map(([name, constructor]) => ({
      name,
      constructor: constructor.name
    }));
  }

  // Force initialization (useful for testing)
  forceInitialize(): void {
    this.initialized = false;
    this.initialize();
  }

  // Clear all registered platforms (useful for testing)
  clear(): void {
    this.platforms.clear();
    this.initialized = false;
  }
}

// Export singleton instance
export const platformRegistry = new PlatformRegistry(); 