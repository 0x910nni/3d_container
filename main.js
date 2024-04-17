//Import
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


//创建场景
const scene = new THREE.Scene();
//摄像机
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

//全局化3D对象
let object;

//鼠标交互控件
let controls;

//设置要渲染的模型，即模型的文件夹名称，用于在下方导入模型的目录部分引用
let objToRender = 'model1'

//创建加载器
const loader = new GLTFLoader();

//载入文件
loader.load(
	`public/${objToRender}/scene.gltf`,
	function (gltf) {
		//模型加载成功后就添加至场景中
		object = gltf.scene;
		scene.add(object);
	},
	function (xhr) {
		//此功能用于记录模型的加载进度
		console.log((xhr.loaded / xhr.total * 100) + '% 已载入');
	},
	function (error) {
		//如果出现错误，记录进日志中
		console.error(error);
	}
);

//创建渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true }); //开启阿尔法以移除背景
renderer.setSize(window.innerWidth, window.innerHeight); //渲染器的尺寸控制

//将渲染器添加至DOM
/*
* DOM（文档对象模型）：
DOM是一个跨平台和语言独立的接口，允许程序和脚本动态地访问和更新内容、结构以及样式。
网页被浏览器解析后，会创建一个DOM树，JavaScript可以通过DOM API操作这个树，比如添加或修改元素。

* 为什么要把渲染器添加到DOM中：
renderer.domElement是Three.js渲染器创建的<canvas>元素，它是一个HTML元素，用于在网页上显示Three.js渲染的图形。
通过document.getElementById("container3D").appendChild(renderer.domElement);将这个<canvas>元素添加到HTML的指定容器中，这样渲染的3D内容才能显示在网页上。
如果不执行这个操作，Three.js渲染的内容将无处显示，用户看不到任何3D图形。
 */
document.getElementById("container3D").appendChild(renderer.domElement);

//旧方块的加载
/*
document.body.appendChild( renderer.domElement );
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
*/

//摄像机控制
//camera.position.z = 5;
/*
这行代码直接将摄像机的z轴位置设置为5。
在Three.js中，z轴通常代表“深度”，负值通常表示向观众方向，正值表示远离观众方向。
设置z为5意味着摄像机位于原点（0,0,0）沿z轴正方向移动了5个单位。这通常用于近距离观察场景的中心或某个特定的对象。
*/

camera.position.z = objToRender === "model2" ? 25 : 0.175;
/*
这行代码使用了JavaScript的条件（三元）运算符，语法为：condition ? exprIfTrue : exprIfFalse。它的意思是：
条件：objToRender === "model2" — 这是一个比较表达式，检查变量objToRender是否等于字符串"model2"。
如果条件为真（即objToRender的值确实是"model2"），那么摄像机的z位置被设置为25。
如果条件为假（即objToRender的值不是"model2"），那么摄像机的z位置被设置为500。
这种设置通常用于根据不同的对象调整摄像机的位置，确保对象被合适地展示。较小的z值意味着摄像机更靠近对象，较大的z值则意味着摄像机离对象更远。
*/


//灯光控制
//*定向光（Directional Light）
const topLight = new THREE.DirectionalLight(0xffffff,3);  //颜色：颜色常常用十六进制代码表示。强度：表示光的强度为正常强度。调整这个参数可以使光源看起来更亮或更暗。
topLight.position.set(10, 50, 50) //位置：设置光源的位置在场景中的(x, y, z)坐标。对于定向光来说，位置主要用于计算阴影，而不影响光线方向。
topLight.castShadow = true; //阴影：使得这个光源能投射阴影。启用阴影会对性能有一定影响，因此只有在需要时才开启。
scene.add(topLight);  //添加定向光源到场景

//*环境光（Ambient Light）
const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "model2" ? 5 : 1);
/*
颜色：0x333333 表示光源颜色为深灰色。颜色较深表示环境光的影响相对较弱，不会完全覆盖其他光源的效果。
强度：此处使用了一个条件表达式来决定环境光的强度，如上方对摄像机的控制，
如果渲染的对象是“model2”，则强度为5，否则为1。这意味着如果场景中有模型2，环境光会更强以突出显示模型2。
*/
scene.add(ambientLight); //添加定向光源到场景


//交互控件

//* 使用鼠标观察模型
if (objToRender === "model2") {
	controls = new OrbitControls(camera, renderer.domElement);
}
/*这段代码检查objToRender变量是否等于"model2"。
如果是，就创建一个新的OrbitControls实例，允许用户通过鼠标操作来旋转和缩放场景中的相机。
renderer.domElement指的是渲染器所创建的canvas元素，它是控制器监听事件的HTML元素。
*/


//动画控制与渲染
function animate() {
	requestAnimationFrame(animate); //这是一个常用于Web动画的函数，它告诉浏览器希望执行动画并请求浏览器在下一次重绘前调用指定的函数来更新动画。这是一个递归调用，形成了一个动画循环。

	//在此添加了一些指令使我们的模型可以自动产生动画，用以支持鼠标等交互
	if (object && objToRender === "model1") {
		object.rotation.y = 1 + mouseX / window.innerWidth * 4;
		object.rotation.x = -1 + mouseY * 3 / window.innerHeight;
		/*
		***计算方式解析：
		mouseX / window.innerWidth * 3：这个表达式首先计算鼠标x位置占窗口宽度的比例，然后将此比例乘以3。目的是将鼠标位置映射到一个更大的旋转范围，以便鼠标移动导致的旋转更加明显。
		-3 + ...：基础旋转值为-3弧度，这样设置是为了给模型一个初始的旋转偏置。
		mouseY * 2.5 / window.innerHeight：类似地，这个表达式将鼠标y位置映射到一个较大的旋转范围，乘以2.5增加灵敏度。
		-1.2 + ...：基础旋转值为-1.2弧度，为模型设置一个初始的垂直旋转偏置。
		*/
	}
	/*
	这些数值可能需要反复的校对与调整才能符合预期手感
	同样的，这里根据鼠标位置动态调整名为object的3D对象的旋转。这个条件检查object是否存在且objToRender变量是否等于"eye"。这是为了确保只有在特定条件下，才执行旋转代码。
	object.rotation.y和object.rotation.x根据鼠标的X和Y位置相对于窗口的比例进行调整，实现当用户移动鼠标时对象看起来像是跟随鼠标移动。
	object.rotation.y和object.rotation.x：
	这些是Three.js中3D对象的属性，分别控制对象绕y轴和x轴的旋转。Three.js中的旋转单位是弧度。
	*/

	/*
	旧方块的动画位置
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	*/

	renderer.render( scene, camera ); //这行代码每次调用animate函数时都会重新渲染场景，从当前相机视角显示场景。
}

//响应式交互功能
//窗口大小监听器
window.addEventListener("resize", function() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

//鼠标位置监听器
let mouseX, mouseY; // 声明变量
//这是一个事件监听器，它绑定到整个文档上，当鼠标在页面上移动时触发。
document.onmousemove = (e) => {
	mouseX = e.clientX; 
	mouseY = e.clientY;
	//这些是事件对象e的属性，代表鼠标当前的水平和垂直位置（以像素为单位），相对于浏览器视窗。
}


//开始渲染
animate();
