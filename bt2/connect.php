<?php
$servername="localhost";
$username= "root";
$password="";
$dbname="form";

$connect = mysqli_connect($servername,$username,$password,$dbname) or die("error to connect");

// function executeResult($sql){
//     $data = [];
//     $result = mysqli_query($connect,$sql);
//     while($row = mysqli_fetch_array($result,1)){
//         $data[] = $row;
//     }
//     mysqli_close($connect);

//     return $data;
// }
?>
