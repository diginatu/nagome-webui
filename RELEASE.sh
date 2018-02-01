#!/bin/sh

yarn run build
cp plugin.yml server_config.json build/
mv build app
zip -r nagome_webui.zip app/
echo "Upload nagome_webui.zip"
