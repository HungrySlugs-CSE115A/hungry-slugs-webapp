from utils import get_db_handle, get_local_db_handle
from private.private_settings import (
    MONGODB_USERNAME,
    MONGODB_PASSWORD,
    MONGODB_CLUSTER,
    IS_DEV,
)

if (
    IS_DEV and False
):  # Remove the False to test locally but you will have to have a local mongodb server running
    db, _ = get_local_db_handle("webapp_backend")
else:
    db, _ = get_db_handle(
        "webapp_backend", MONGODB_PASSWORD, MONGODB_USERNAME, MONGODB_CLUSTER
    )
