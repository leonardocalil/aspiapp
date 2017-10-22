var url_validate_employee_user = 'http://31.220.53.196:8080/RestaurantWSRest/rest/employee/validateUser';
var url_validate_client_user = 'http://31.220.53.196:8080/RestaurantWSRest/rest/client/validateUser';


var url_product_type_get_all = 'http://31.220.53.196:8080/RestaurantWSRest/rest/producttype/getAll';
var url_product_type_get = 'http://31.220.53.196:8080/RestaurantWSRest/rest/producttype/get/';
var url_product_type_save = 'http://31.220.53.196:8080/RestaurantWSRest/rest/producttype/save';
var url_product_type_delete = 'http://31.220.53.196:8080/RestaurantWSRest/rest/producttype/delete/';

var url_product_item_get_all = 'http://31.220.53.196:8080/RestaurantWSRest/rest/product/getAllJson';
var url_product_item_get = 'http://31.220.53.196:8080/RestaurantWSRest/rest/product/get/';
var url_product_item_save = 'http://31.220.53.196:8080/RestaurantWSRest/rest/product/save';
var url_product_item_delete = 'http://31.220.53.196:8080/RestaurantWSRest/rest/product/delete/';

var url_product_get_by_type = 'http://31.220.53.196:8080/RestaurantWSRest/rest/product/getByType/';

var url_employee_role_get_all = 'http://31.220.53.196:8080/RestaurantWSRest/rest/role/getAll';
var url_employee_role_get = 'http://31.220.53.196:8080/RestaurantWSRest/rest/role/get/';
var url_employee_role_save = 'http://31.220.53.196:8080/RestaurantWSRest/rest/role/save';
var url_employee_role_delete = 'http://31.220.53.196:8080/RestaurantWSRest/rest/role/delete/';

var url_employee_person_get_all = 'http://31.220.53.196:8080/RestaurantWSRest/rest/employee/getAll';
var url_employee_person_get = 'http://31.220.53.196:8080/RestaurantWSRest/rest/employee/get/';
var url_employee_person_save = 'http://31.220.53.196:8080/RestaurantWSRest/rest/employee/save';
var url_employee_person_delete = 'http://31.220.53.196:8080/RestaurantWSRest/rest/employee/delete/';
var url_employee_person_update_access = 'http://31.220.53.196:8080/RestaurantWSRest/rest/employee/update_access/';
var url_employee_person_exists_login = 'http://31.220.53.196:8080/RestaurantWSRest/rest/employee/existsLogin/';


var url_site_get_all = 'http://31.220.53.196:8080/RestaurantWSRest/rest/site/getAll';
var url_site_delete = 'http://31.220.53.196:8080/RestaurantWSRest/rest/site/delete';
var url_site_save = 'http://31.220.53.196:8080/RestaurantWSRest/rest/site/save'
	
var url_order_get_all = 'http://31.220.53.196:8080/RestaurantWSRest/rest/order/getAll';	
var url_order_get_queue = 'http://31.220.53.196:8080/RestaurantWSRest/rest/order/getQueue/';
var url_order_update_status = 'http://31.220.53.196:8080/RestaurantWSRest/rest/order/updateStatus/';
var url_order_put = 'http://31.220.53.196:8080/RestaurantWSRest/rest/order/put/';


var url_client_save = 'http://31.220.53.196:8080/RestaurantWSRest/rest/client/save';
var url_client_exists_login = 'http://31.220.53.196:8080/RestaurantWSRest/rest/employee/existsLogin/';

function newProductType() {
	return {id: 0, description:""};
}
function newProductItem() {
	return {id: 0, productType:{id:0,description:""},name:"",description:"",cost_price:"0",sale_price:"0"};
}

function newEmployeeRole() {
	return {id: 0, name:"",description:""};
}

function newEmployeePerson() {
	return {id: 0, name:"", document:"", phone:"", email:"", address_name:"",address_number:"",address_complement:"",zip_code:"",login:"",password:"",access_level:0,role:{},boss:{}};
}
function newStore() {
	return {id: 0, name:"", physical_store:0,document:"", phone:"", email:"", address_name:"",address_number:"",address_complement:"",zip_code:""};
}

function newUser() {

return {id: 0, name: "", phone: "", email: "", document: "", address_name: "", address_number: "", address_complement: "", zip_code: "", creditcard_number: "", creditcard_name: "", creditcard_flag: "", creditcard_security_code: "",login:"",password:""}

}
