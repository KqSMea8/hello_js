/*
███    ██ ███████ ██     ██
████   ██ ██      ██     ██
██ ██  ██ █████   ██  █  ██
██  ██ ██ ██      ██ ███ ██
██   ████ ███████  ███ ███
*/

function Student(name, age) {
	// 构造函数中的 this 指向 new 出来的实例对象
	this.name = name; // this === s
	this.age = age; // this === s
}
Student.prototype = {
	// 使用new时，默认会在prototype中添加constructor来指向构造函数
	// 我们这里重新给prototype赋值一个新的对象，原有的constructor就没了，所以可以手动赋值
	// 如果不想覆盖掉prototype中原有的东西，就要使用Student.prototype.study = function() {} 这种形式赋值
	constructor: Student,
	type: 'student',
	study: function() {
		console.log('studing');
	}
}
let s = new Student("wtl", 22);
// new 是一个语法糖，具体执行如下
// 1.创建一个新对象，作为返回的对象实例
// var tempObj = {}
// 2.__proto__指向构造函数的prototype
// tempObj.__proto__ = Student.prototype
// 3.执行构造函数
// tempObj.name = name
// tempObj.age = age
// 4.返回对象实例
// return tempObj


/*
██████  ██████   ██████  ████████  ██████  ████████ ██    ██ ██████  ███████
██   ██ ██   ██ ██    ██    ██    ██    ██    ██     ██  ██  ██   ██ ██
██████  ██████  ██    ██    ██    ██    ██    ██      ████   ██████  █████
██      ██   ██ ██    ██    ██    ██    ██    ██       ██    ██      ██
██      ██   ██  ██████     ██     ██████     ██       ██    ██      ███████
*/
// 万物皆对象，对象都有__proto__，指向构造该对象的构造函数的prototype，用来构成原型链
// 构造函数，函数是特殊的对象，额外拥有prototype原型对象
// prototype 用于实现基于原型的继承与属性共享，规定了所有实例共享的属性和方法
function Person(name, age) {
	// 函数中的 this 指向 new 出来的实例对象
	this.name = name || "wuming";
	this.age = age || 18;
}
// 使用以下方法向prototype中添加属性和函数，不会破坏constructor
Person.prototype.gender = "DK";
Person.prototype.race = "DK";
Person.prototype.sayName = function() {
	console.log(`I'm ${this.name}`);
};

// 利用构造函数新建实例对象
let tom = new Person("tom"); // Person { name: 'tom', age: 18 }

// prototype与__proto__:
// 生产环境中不推荐用__proto__ 推荐使用Object.getPrototypeOf(obj)

const obj = {}
// obj直接由Object构造来，所以
obj.__proto__ === Object.prototype

// Object跟Person一样，都是构造函数，因此__proto__指向Function.prototype
Person.__proto__ === Function.prototype
Function.__proto__ === Function.prototype
Object.__proto__ === Function.prototype
// 函数的原型对象就是一个普通对象，因此其__proto__指向Object.prototype 这是原型链的最顶端
Function.prototype.__proto__ === Object.prototype
// tom由Person构造来，因此其__proto__指向Person的原型对象
tom.__proto__ === Person.prototype
// 原型对象有一个constructor属性，指回构造方法
Person.prototype.constructor = Person
// 可以参照proto.jpg理解


// 原型链在更新值时是不起作用的，只有在检索值的时候才会起作用
// 尝试获取某个对象的属性时，如果该对象没有该属性(通过this定义)，则会查找其原型对象(Person.prototype)中的属性
// 如果原型对象也没有该属性，则继续顺着原型链找(Person.prototype.__proto__)，直到终点Object.prototype
// 如果完全不存在于原型链中，则返回undefined
Person.prototype.wen = '111'
Object.prototype.wen = '222'
// tom本身没有this.wen，所以查找tom.__proto__即Person.prototype，找到了111
// 如果还没有，则继续查找tom.__proto__.__proto__即Person.prototype.__proto__即Object.prototype
console.log(tom.wen) // '111'

// 在tom中定义gender，属于实例属性，不影响原型链上的
tom.gender = "男"
// 再查找gender时，直接在自身就找到了，不用访问原型链
// 因此实例对象的gender为男
// 原型对象中的gender仍然是DK
tom.__proto__.gender // DK


// 直接输出，不包括原型链中的内容
console.log(tom); // Person { name: 'tom', age: 18, gender: '男' }
// typeof可以用来检查属性是否存在
typeof tom.xxx === "undefined"; // true
// hasOwnProperty只检查当前对象(通过this定义) 不会检查原型链
tom.hasOwnProperty("gender"); // true 因为前面通过tom.gender定义了
tom.hasOwnProperty("race"); // false

// for in 遍历对象，in操作符会查找原型链
for (let k in tom) {
	console.log(`${k}: ${tom[k]}`);
	/*
	name: tom
	age: 18
	gender: 男
	race: DK
	sayName: function() {
	    console.log(`I'm ${this.name}`);
	}
	wen: 111
	*/
}


/*
██ ███    ██ ██   ██ ███████ ██████  ██ ████████
██ ████   ██ ██   ██ ██      ██   ██ ██    ██
██ ██ ██  ██ ███████ █████   ██████  ██    ██
██ ██  ██ ██ ██   ██ ██      ██   ██ ██    ██
██ ██   ████ ██   ██ ███████ ██   ██ ██    ██
*/
// 1.使用 call 改变构造函数的 this 实现继承
function Parent() {
	this.name = 'parent'
	this.arr = [1, 2, 3]
}
Parent.prototype.sayHello = () => {}
function Child1() {
	Parent.call(this)
	this.type = 'child1'
}
// 只能继承父类实例属性/方法，不能继承原型属性/方法
let child1 = new Child1()  // Child1 { name: 'parent', type: 'child1' }

// 2.借助原型链实现继承
function Child2() {
	this.type = 'child2'
}
// 将子类的原型对象赋值为父类的实例，这样既继承了父类的实例方法又继承了父类的原型方法
Child2.prototype = new Parent()
// 子类实例的 __proto__ 指向构造函数的 prototype，即父类的实例对象，继承了父类的实例属性/方法
// 父类的实例 __proto__ 又指向父类构造函数 prototype，因此也继承了父类的原型属性/方法
let child2 = new Child2()
let child22 = new Child2()
// 这样的缺点是: 父类的引用型实例属性 保存在子类实例的 __proto__ ，因此是子类实例之间共享的
// child2没有自己的 arr 属性， 修改 child2.arr 会影响其他的 child
child22.arr // [ 1, 2, 3 ]
child2.arr.push(4)
child22.arr // [ 1, 2, 3, 4 ]


// 3.组合继承 (组合 1 2 两种方法)
function Child3() {
	// 将父类的实例属性/方法直接放到子类的实例中来，避免了方法2的缺点
	Parent.call(this)
	this.type = 'child3'
}
// 然后再将子类的 prototype 赋值为父类实例，这样虽然原型链中间还有一层，但是这一层的值在子类实例中都有
Child3.prototype = new Parent()
let child3 = new Child3()
// 这样的缺点是: 调用了两次 new，其中子类构造函数的 prototype 这一层是没有必要的，
// 因为其中的父类实例属性/方法已经在子类构造函数中继承了
let child33 = new Child3();


// 4.组合继承优化(1)
function Child4() {
	Parent.call(this)
	this.type = 'child4'
}
// 方法3中我们发现 子类实例的 __proto__ 指向父类实例，但是父类实例的属性/方法我们已经在子类的构造方法中定义了
// 因此这一层 __proto__ 是多余的，所以可以直接将子类实例的 __proto__ 指向父类构造方法的 prototype
// 即 子类构造方法的 prototype 指向父类构造方法的 prototype
Child4.prototype = Parent.prototype
let child4 = new Child4()
// 当然还是有缺陷: 子类构造方法的 prototype 就是父类构造方法的 prototype
// 那子类构造方法的 prototype 中的 constructor 就是 Parent()
// 所以通过 instanceof 判断是哪个类的实例时是无法区分子类和父类实例的
child4 instanceof Child4 // true
child4 instanceof Parent // true


// 5.组合继承优化(2)
function Child5() {
	Parent.call(this)
	this.type = 'child5'
}
// 解决子类构造方法的 prototype 和父类构造方法的 prototype 相同的问题
// 用 Object.create() 函数构造一个新的对象，新对象 __proto__ 指向父类构造方法的 prototype
// 然后更改这个新对象的 constructor 属性，指向 Child5
Child5.prototype = Object.create(Parent.prototype)
Child5.prototype.constructor = Child5
let child5 = Child5()
child5 instanceof Parent // false


// 6.ES6 中使用 Class 继承
// 类名相当于 ES5 的构造函数
class Parent6 {
	// 父类构造函数
	constructor(name) {
		// this 指向实例
		this.name = name || 'Parent6'
	}
	// 定义在 class 内的都是原型方法
	sayHello() {
		console.log('hello from parent');
	}
}
// 使用 extends 关键字进行继承
class Child6 extends Parent6 {
	constructor(name, age) {
		// ES5实现继承，是先建立子类的this，然后把父类的实例属性/方法添加到该this上
		// ES6则完全不同，ES6必须先调用父类的构造函数来构成 this，然后再对该 this 进行子类的加工
		// 只有调用super之后，才可以使用this关键字
		super(name)
		this.age = age || 20
	}
}
let child6 = new Child6()
// class是语法糖，实现的方法类似方法3，子类.prototype = new 父类()
child6.__proto__ instanceof Parent6			// true
Child6.prototype instanceof Parent6			// true
child6.__proto__ === Child6.prototype		// true
// 但是修改了constructor指向  子类.prototype.constructor = class 子类
// class 和构造函数有区别，不能区分是子类的实例还是父类的实例
child6 instanceof Chilad6								// true
child6 instanceof Parent6								// true



/*
██████   ██████  ██   ██    ██ ███    ███  ██████  ██████  ██████  ██   ██ ██  ██████
██   ██ ██    ██ ██    ██  ██  ████  ████ ██    ██ ██   ██ ██   ██ ██   ██ ██ ██
██████  ██    ██ ██     ████   ██ ████ ██ ██    ██ ██████  ██████  ███████ ██ ██
██      ██    ██ ██      ██    ██  ██  ██ ██    ██ ██   ██ ██      ██   ██ ██ ██
██       ██████  ███████ ██    ██      ██  ██████  ██   ██ ██      ██   ██ ██  ██████
*/

// 实现多态:同一个操作作用于不同对象，得到不同的执行方式和结果
// 将“做什么” 和 “谁来做、怎么做” 分开
var shout = function(animal) {
	animal.shout();
};
var Duck = function() {};
Duck.prototype.shout = function() {
	console.log('gagaga');
};
var Chicken = function() {};
Chicken.prototype.shout = function() {
	console.log('jijiji');
};

shout(new Duck()); // gagaga
shout(new Chicken()); // jijiji
