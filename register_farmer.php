<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Generate FarmerID (11000XXXXXX format)
    $last_id_query = "SELECT MAX(FarmerID) as max_id FROM FARMER";
    $result = $conn->query($last_id_query);
    $row = $result->fetch_assoc();
    $last_id = $row['max_id'];
    $new_id = $last_id ? $last_id + 1 : 11000000001;
    
    // Get form data
    $data = json_decode(file_get_contents('php://input'), true);
    
    $sql = "INSERT INTO FARMER (FarmerID, Name, Village, ContactNumber, AadharNumber, BankAccountNumber, BranchName, IFSCCode, RegistrationDate, Status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), 'Active')";
            
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssss", 
        $new_id,
        $data['name'],
        $data['village'],
        $data['contact'],
        $data['aadhar'],
        $data['account'],
        $data['branch'],
        $data['ifsc']
    );
    
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'FarmerID' => $new_id]);
    } else {
        echo json_encode(['status' => 'error', 'message' => $stmt->error]);
    }
    
    $stmt->close();
    $conn->close();
}
?>