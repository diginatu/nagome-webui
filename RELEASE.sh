#!/bin/sh

npm run build
cp plugin.yml server_config.json build/
mv build app
zip -r nagome_webui.zip app/