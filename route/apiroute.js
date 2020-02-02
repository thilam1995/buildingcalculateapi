const express = require('express');
const accountctrl = require('../modelctrl/Account');
const projectctrl = require('../modelctrl/Project');
const designctrl = require('../modelctrl/Design');
const wallctrl = require('../modelctrl/Wall');
const windowctrl = require('../modelctrl/WindowsObject');
const doorctrl = require('../modelctrl/Door');
const roofctrl = require("../modelctrl/Roof");
const skylight = require('../modelctrl/Skylights');
const floor = require('../modelctrl/Floors');
const wallwindowdoormodel = require("../modelctrl/Wallwindowdoormodel");
const roofskylightmodel = require('../modelctrl/RoofSkylightmodel');
const floormodel = require("../modelctrl/Floormodel");
const roomhabit = require("../modelctrl/Room");

const router = express.Router();

//Part for account
router.post('/account/forgotpass', accountctrl.forgotPassword);
router.put('/account/changename/:id', accountctrl.changeName);
router.put('/account/:id', accountctrl.updateAccount);
router.post('/account', accountctrl.registerAccount);
router.post('/login', accountctrl.accountLogin);
// router.delete('/account');

//Part for project
router.get('/project/:id', projectctrl.getProjectbyuserid);
router.get('/projectid/:projectid', projectctrl.getProjectbyid);
router.put('/project/:id', projectctrl.updateProject);
//router.put('/project/updatedate/:id');
router.post('/project', projectctrl.insertproject);
router.delete('/project/:id', projectctrl.deleteproject);

//Part for design
router.get('/design/:projectid', designctrl.getdesignbyprojectID);
router.get('/design/getdesign/:designid', designctrl.getdesignbyid);
router.get('/design/last/:datetime' , designctrl.getdesignbydatecreated);
router.put('/design/:id', designctrl.updatedesign);
router.post('/design', designctrl.postdesign);
router.delete('/design/:id', designctrl.deletedesign);

//Part for Wall
router.get('/wall/:id', wallctrl.getwallbyID);
router.put('/wall/:id', wallctrl.updatewall);
router.post('/wall', wallctrl.insertwall);
router.delete('/wall/:id', wallctrl.deletewall);

//Part for windows
router.get('/window/:id', windowctrl.getwindowbyID);
router.put('/window/:id', windowctrl.updatewindow);
router.post('/window', windowctrl.insertwindow);
router.delete('/window/:id', windowctrl.deletewindow);
//Part for door
router.get('/door/:id', doorctrl.getdoorbyID);
router.put('/door/:id', doorctrl.updatedoor);
router.post('/door', doorctrl.insertdoor);
router.delete('/door/:id', doorctrl.deletedoor);
//Part for roof
router.get('/roof/:id', roofctrl.getroofbyID);
router.put('/roof/:id', roofctrl.updateroof);
router.post('/roof', roofctrl.insertroof);
router.delete('/roof/:id', roofctrl.deleteroof);
//Part for skylights
router.get('/skylight/:id', skylight.getskylightbyID);
router.put('/skylight/:id', skylight.updateskylight);
router.post('/skylight', skylight.insertskylight);
router.delete('/skylight/:id', skylight.deleteskylight);
//Part for floor
router.get('/floor/:id', floor.getfloorbyID);
router.put('/floor/:id', floor.updatefloor);
router.post('/floor', floor.insertfloor);
router.delete('/floor/:id', floor.deletefloor);
//Part for wallwindowdoor model
router.get('/wallwindowdoormodel/:id', wallwindowdoormodel.getwallwindowdoormodelbyID);
router.put('/wallwindowdoormodel/:id', wallwindowdoormodel.updatewallwindowdoormodel);
router.post('/wallwindowdoormodel', wallwindowdoormodel.insertwallwindowdoormodel);
router.delete('/wallwindowdoormodel/:id', wallwindowdoormodel.deletewallwindowdoormodel);
//Part for roofskylight model
router.get('/roofskylightmodel/:id', roofskylightmodel.getroofskylightmodelbyID);
router.put('/roofskylightmodel/:id', roofskylightmodel.updateroofskylightmodel);
router.post('/roofskylightmodel', roofskylightmodel.insertroofskylightmodel);
router.delete('/roofskylightmodel/:id', roofskylightmodel.deleteroofskylightmodel);
//Part for floor models
router.get('/floormodel/:id', floormodel.getfloormodelbyID);
router.put('/floormodel/:id', floormodel.updatefloormodel);
router.post('/floormodel', floormodel.insertfloormodel);
router.delete('/floormodel/:id', floormodel.deletefloormodel);

//Part for room habit models
router.get('/roomhabit/:id', roomhabit.getroomhabitbydesignid);
router.put('/roomhabit/:id', roomhabit.updateroomhabit);
router.post('/roomhabit', roomhabit.postroomhabit);
router.delete('/roomhabit/:id', roomhabit.deleteroomhabit);

module.exports = router;