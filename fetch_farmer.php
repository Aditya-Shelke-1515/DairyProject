<?php
include 'config.php';

if (isset($_POST['FarmerID'])) {
    $FarmerID = $_POST['FarmerID'];
    
    // Query to get farmer details
    $sql = "SELECT * FROM FARMER WHERE FarmerID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $FarmerID);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $farmer = $result->fetch_assoc();
        
        
       
        // Combine data and return as JSON
        $response = [
            'status' => 'success',
            'farmer' => $farmer,
           
        ];
        
        echo json_encode($response);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Farmer not found']);
    }
    
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'No FarmerID provided']);
}
?>