var express =require("express");

var controller=require("./controller");

var router=express.Router();

router.post("/inventoryRecord",controller.inventory);
router.patch("/deliveryRecord/:serial_num",controller.delivery);
router.patch("/activationRecord/:serial_num",controller.activation);
router.patch("/reviewRecord/:serial_num",controller.review);
router.get("/records/:serial_num",controller.recordSummary);
router.get("/records",controller.fetchRecords);

module.exports=router;
