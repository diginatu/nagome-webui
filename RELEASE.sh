#!/bin/sh

npm run build
cp plugin.yml server_config.json build/
rm -fr app
mv build app
zip -r nagome_webui.zip app/
echo "Upload nagome_webui.zip"
