import os
import sys
import time
import subprocess
import threading
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Files or directories to ignore
IGNORE_PATTERNS = [
    r"[\\/]documentation[\\/]",
    r"[\\/]\.git[\\/]",
    r"[\\/]node_modules[\\/]",
    r"CHANGELOG\.md",
    r"generate_docs\.py",
    r"watch_docs\.py",
    r"install_hooks\.py",
    r"\.gitattributes",
    r"\.gitignore",
    r"~\$"  # Word lock files
]

class DebouncedDocGen:
    def __init__(self, delay=2.0):
        self.delay = delay
        self.last_event_time = 0.0
        self.lock = threading.Lock()
        self.timer = None

    def trigger(self, filepath):
        # Check if the file should be ignored
        for pattern in IGNORE_PATTERNS:
            if re.search(pattern, filepath, re.IGNORECASE):
                return
        
        with self.lock:
            self.last_event_time = time.time()
            if self.timer is not None:
                self.timer.cancel()
            
            self.timer = threading.Timer(self.delay, self.run_generation)
            self.timer.start()
            print(f"Detected change in: {filepath}. Scheduling generation in {self.delay}s...")

    def run_generation(self):
        print("Starting automated documentation regeneration...")
        try:
            # Run generate_docs.py in a sub-process
            result = subprocess.run(
                ["python", "generate_docs.py"],
                capture_output=True,
                text=True,
                check=True
            )
            print(result.stdout)
            print("Automated regeneration complete!")
        except subprocess.CalledProcessError as e:
            print(f"Error during automated regeneration:\n{e.stderr}")
        except Exception as ex:
            print(f"Unexpected regeneration error: {ex}")

import re # needed for pattern matching

class FileWatcherHandler(FileSystemEventHandler):
    def __init__(self, debouncer):
        super().__init__()
        self.debouncer = debouncer

    def on_modified(self, event):
        if not event.is_directory:
            self.debouncer.trigger(event.src_path)

    def on_created(self, event):
        if not event.is_directory:
            self.debouncer.trigger(event.src_path)

    def on_deleted(self, event):
        if not event.is_directory:
            self.debouncer.trigger(event.src_path)

def main():
    path = os.path.abspath(".")
    print(f"Starting directory watcher on: {path}")
    print("Watching for code changes to regenerate documentation...")
    
    debouncer = DebouncedDocGen()
    event_handler = FileWatcherHandler(debouncer)
    
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)
    observer.start()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        print("Stopping directory watcher...")
    observer.join()

if __name__ == "__main__":
    main()
