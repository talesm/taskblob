/**
 * @file Group.js
 * @author TalesM
 * 
 */

////Defining subclass.
//Group.prototype = Object.create(Item.prototype);
//Group.prototype.constructor = Group;
///**
// * @constructor
// */
//function Group(id, name, description, children, dependencies) {
//	Item.call(this, id, null, name, description, dependencies);
//	this.subTasks = [];
//	if(children){
//		children.forEach(function(kid) {
//			if(this.depedents.every(function(depedent){
//				return kid.dependency;
//			})
//			&& !this.depedencies.some(function(depedent){
//				return kid.hasDependency(depedent);
//			})){
//				
//			}
//		}, this);
//	}
//}