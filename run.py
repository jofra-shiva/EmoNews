import subprocess
import os
import signal
import sys
import time

def run_project():
    # Set environment variables if needed
    env = os.environ.copy()
    env["NODE_OPTIONS"] = "--openssl-legacy-provider"

    # Define the commands to run
    # 1. Backend Server
    backend_cmd = "npm start --prefix server"
    # 2. Frontend React App
    frontend_cmd = "npm start --prefix client"

    print("🚀 Starting Backend and Frontend...")

    try:
        # Start Backend
        print(f"Starting Backend: {backend_cmd}")
        backend_proc = subprocess.Popen(
            backend_cmd, 
            shell=True, 
            env=env,
            creationflags=subprocess.CREATE_NEW_CONSOLE if os.name == 'nt' else 0
        )
        
        # Small delay to let backend start
        time.sleep(2)

        # Start Frontend
        print(f"Starting Frontend: {frontend_cmd}")
        frontend_proc = subprocess.Popen(
            frontend_cmd, 
            shell=True, 
            env=env,
            creationflags=subprocess.CREATE_NEW_CONSOLE if os.name == 'nt' else 0
        )

        print("\n✅ Both processes are running in separate windows.")
        print("Press Ctrl+C in those windows to stop them, or close the windows.")
        
        # Keep this script alive while processes are running
        while True:
            if backend_proc.poll() is not None and frontend_proc.poll() is not None:
                break
            time.sleep(1)

    except KeyboardInterrupt:
        print("\nShutting down...")
        backend_proc.terminate()
        frontend_proc.terminate()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    run_project()
