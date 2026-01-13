# backend/conftest.py
import os
import sys

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

# Ensure the backend root (this directory) is on sys.path
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

