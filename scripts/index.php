<?php
/**
 * SOVEREIGN PHP BRIDGE
 * Bypasses Apache Proxy Restrictions by tunneling traffic via PHP
 */

$backend_url = "http://127.0.0.1:3000";
$request_uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Parse headers
$headers = [];
foreach (getallheaders() as $name => $value) {
    if ($name != "Host") {
        $headers[] = "$name: $value";
    }
}

// Init Protocol
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $backend_url . $request_uri);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);

if ($method === 'POST') {
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
}

// Execute
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$header_text = substr($response, 0, $header_size);
$body = substr($response, $header_size);

curl_close($ch);

// Forward Headers
foreach (explode("\r\n", $header_text) as $header) {
    if (!empty($header) && strpos($header, 'Transfer-Encoding') === false) {
        header($header);
    }
}

http_response_code($http_code);
echo $body;
?>
