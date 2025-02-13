# Moodle Chat AI Plugin Documentation

## Overview
This documentation details the installation and configuration process for the Moodle Chat AI Plugin, which enables AI-powered chat functionality within Moodle courses.

## Server Requirements
- Node.js
- npm
- Apache HTTP Server
- systemd

## Installation Steps

### 1. Server Dependencies
Install the required Node.js and npm packages:
```bash
dnf install nodejs
dnf install npm
```

### 2. Apache Configuration
Edit the Virtual Host configuration file for your SSL-enabled site:
```bash
nano /etc/httpd/sites-available/nome.do.site-le-ssl.conf
```

Add the following proxy modules:
```apache
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule proxy_wstunnel_module modules/mod_proxy_wstunnel.so
```

Add these configuration settings:
```apache
# Debug Logs
LogLevel debug
ErrorLog /var/log/httpd/websocket_error.log
CustomLog /var/log/httpd/websocket_access.log combined

# Proxy Configuration
ProxyRequests Off
ProxyPreserveHost On

# WebSocket Configuration
ProxyPass /ead/ws ws://localhost:3000/
ProxyPassReverse /ead/ws /ead/admin/tool/meurelatorio/index.php ws://localhost:3000/

# WebSocket Support
RewriteEngine On
RewriteCond %{HTTP:Upgrade} websocket [NC]
RewriteCond %{HTTP:Connection} upgrade [NC]
RewriteRule ^/ead/ws(.*) "ws://localhost:3000/$1" [P,L]

# Security Headers
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
```

Restart Apache after making changes:
```bash
systemctl restart httpd
```

### 3. systemd Service Configuration
Create a new systemd service file:
```bash
nano /etc/systemd/system/websocket.service
```

Add the following configuration:
```ini
[Unit]
Description=WebSocket Server
After=network.target

[Service]
ExecStart=/usr/bin/node /caminho/para/seu/arquivo.js
Restart=Always
User=seu-usuario
Group=seu-usuario
Environment=NODE_ENV=production
WorkingDirectory=/caminho/para/seu/projeto

[Install]
WantedBy=multi-user.target
```

**Note**: Replace the following placeholders:
- `/caminho/para/seu/arquivo.js` with your actual JavaScript file path
- `seu-usuario` with the appropriate system user
- `/caminho/para/seu/projeto` with your project directory path

### 4. Service Management
Initialize and start the service:
```bash
# Reload systemd configuration
systemctl daemon-reload

# Start the WebSocket service
systemctl start websocket

# Enable service on boot
systemctl enable websocket

# Check service status
systemctl status websocket
```

### 5. Plugin Dependencies
The plugin comes with pre-installed dependencies. However, if needed, you can install them manually:
```bash
# Install specific dependencies
npm install ws
npm install axios

# Or install all dependencies from package.json
npm i
```

## Troubleshooting
- Check the WebSocket logs at `/var/log/httpd/websocket_error.log` and `/var/log/httpd/websocket_access.log`
- Verify the WebSocket service status using `systemctl status websocket`
- Ensure all Apache modules are properly loaded
- Check firewall settings if experiencing connection issues

## Security Considerations
- The configuration includes security headers for enhanced protection
- Ensure proper file permissions for service files and logs
- Keep Node.js and npm packages updated
- Regular monitoring of error logs is recommended