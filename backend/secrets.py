import os
import sys

parentDir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parentDir)
from private.private_settings import DJANGO_SECRET_KEY, IS_DEV
