<?php
// SOVEREIGN SENTINEL
// Forces Node.js Process Vitality via Web Request

$secret_key = "sovereign_logic_123";
if ($_GET['key'] !== $secret_key) {
    die("ACCESS DENIED");
}

header('Content-Type: text/plain');

// Configuration
$user = "u110877386";
$home = "/home/$user";
$node_bin = "$home/.nvm/versions/node/v20.19.6/bin";
$path = "export PATH=$node_bin:\$PATH";
$app_dir = "$home/public_html";

echo "SENTINEL: Checking Pulse...\n";

// 1. Check Process
$check_cmd = "$path && pm2 pid getyousite-platform";
$pid = trim(shell_exec($check_cmd));

if (is_numeric($pid) && $pid > 0) {
    echo "STATUS: ONLINE (PID: $pid)\n";
} else {
    echo "STATUS: OFFLINE. INITIATING RESURRECTION...\n";
    
    // 2. Resurrection
    $start_cmd = "$path && cd $app_dir && PORT=3000 pm2 start server.js --name 'getyousite-platform' 2>&1";
    $output = shell_exec($start_cmd);
    $save = shell_exec("$path && pm2 save");
    
    echo "OUTPUT: $output\n";
}
?>
