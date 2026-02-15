#!/bin/bash
set -e

# ============================================
# Deploy script: uploads media to S3 bucket
# and deploys function code to Yandex Cloud
# ============================================

# --- Config ---
BUCKET_NAME="gift-bucket"
FUNCTION_NAME="gift-function"
RUNTIME="nodejs16"
ENTRYPOINT="index.handler"
S3_ENDPOINT="https://storage.yandexcloud.net"
YC_BIN="$HOME/yandex-cloud/bin"

# Env vars for the function (set these in your shell or .env file before running)
# export YANDEX_ACCESS_KEY_ID="..."
# export YANDEX_SECRET_ACCESS_KEY="..."
PINCODE="${PINCODE:-2193}"
YANDEX_ACCESS_KEY_ID="${YANDEX_ACCESS_KEY_ID:?Set YANDEX_ACCESS_KEY_ID env var}"
YANDEX_SECRET_ACCESS_KEY="${YANDEX_SECRET_ACCESS_KEY:?Set YANDEX_SECRET_ACCESS_KEY env var}"
YANDEX_BUCKET_NAME="$BUCKET_NAME"

# Paths
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/old-backend"
MEDIA_DIR="$SCRIPT_DIR/media"

export PATH="$YC_BIN:$PATH"
export AWS_ACCESS_KEY_ID="$YANDEX_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$YANDEX_SECRET_ACCESS_KEY"

# --- Usage ---
usage() {
    echo "Usage: ./deploy.sh [command]"
    echo ""
    echo "Commands:"
    echo "  all       Upload media + deploy function (default)"
    echo "  media     Upload media folder to S3 only"
    echo "  function  Deploy function code only"
    echo "  ls        List bucket contents"
    echo ""
    echo "Media files go in: ./media/gifts/"
    echo "Function code in:  ./old-backend/"
}

# --- Upload media to S3 ---
deploy_media() {
    if [ ! -d "$MEDIA_DIR" ]; then
        echo "Error: media/ folder not found. Create it and add your files."
        echo "Expected structure:"
        echo "  media/"
        echo "    background-music.mp3"
        echo "    gifts/"
        echo "      gift1/"
        echo "        photo.jpg"
        echo "        ..."
        echo "      gift2/"
        echo "        ..."
        exit 1
    fi

    echo "==> Uploading media to s3://$BUCKET_NAME/ ..."
    aws s3 sync "$MEDIA_DIR" "s3://$BUCKET_NAME/" \
        --endpoint-url "$S3_ENDPOINT" \
        --delete \
        --exclude ".*"
    echo "==> Media upload done."
}

# --- Deploy function ---
deploy_function() {
    if [ ! -f "$BACKEND_DIR/index.js" ]; then
        echo "Error: old-backend/index.js not found."
        exit 1
    fi

    echo "==> Deploying function '$FUNCTION_NAME' ..."
    yc serverless function version create \
        --function-name "$FUNCTION_NAME" \
        --runtime "$RUNTIME" \
        --entrypoint "$ENTRYPOINT" \
        --memory 128MB \
        --execution-timeout 10s \
        --source-path "$BACKEND_DIR" \
        --environment "PINCODE=$PINCODE,YANDEX_ACCESS_KEY_ID=$YANDEX_ACCESS_KEY_ID,YANDEX_SECRET_ACCESS_KEY=$YANDEX_SECRET_ACCESS_KEY,YANDEX_BUCKET_NAME=$YANDEX_BUCKET_NAME"
    echo "==> Function deploy done."
}

# --- List bucket ---
list_bucket() {
    echo "==> Contents of s3://$BUCKET_NAME/:"
    aws s3 ls "s3://$BUCKET_NAME/" --endpoint-url "$S3_ENDPOINT" --recursive
}

# --- Main ---
COMMAND="${1:-all}"

case "$COMMAND" in
    all)
        deploy_media
        echo ""
        deploy_function
        ;;
    media)
        deploy_media
        ;;
    function)
        deploy_function
        ;;
    ls)
        list_bucket
        ;;
    *)
        usage
        ;;
esac
