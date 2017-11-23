#!/bin/sh

npm run build
cp plugin.yml server_config.json build/
zip -r nagome_webui.zip build/
