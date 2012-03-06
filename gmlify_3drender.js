
// JS for GMLify 
// by Feesta
// for the Creator's Project/GAFFTA Art Hackday

var strokes = [];
var $container,
    renderer,
    camera,
    scene;
var Z = 0;


function getGMLJSON(callback) {
    $.ajax({
        // url:"http://000000book.com/data/39027.json",
        url:"http://000000book.com/data/random.json",
        // url:"./sample.json",
        dataType:"jsonp",
        success:function(data){
            // console.log(data);
            if (data['gml']['tag'] != undefined && data['gml']['tag']['drawing'] != undefined && data['gml']['tag']['drawing']['stroke'] != undefined) {
                console.info("GML id: " + data['id']);
                    
                strokes = data['gml']['tag']['drawing']['stroke'];

            }
            if (strokes.length > 0) {
                callback();
            } else getGMLJSON(callback);
        }
    });
}

function canvas_init() {
    var WIDTH = $(window).width();
    var HEIGHT = $(window).height();

    var VIEW_ANGLE = 45,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 10000;
    $container = $('#gmlify_canvas');


    renderer = new THREE.CanvasRenderer();
    renderer.AA = false;
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene = new THREE.Scene();
    renderer.setSize(WIDTH, HEIGHT);

    camera.position.set(0,0,500);

    $container.html("").append(renderer.domElement);

}


function renderGML(callback) {
	var last_time = 0;
    if (!$("#gmlify_canvas").length) {
        $("<div id='gmlify_canvas'></div>").css({
            width:'100%',
            height:'100%',
            position:'absolute',
            top:0,
            left:0,
            'z-index':9999999999
        }).appendTo('body');
        canvas_init();
    };

    if (strokes.length) {
        var last_time;
        for (var s in strokes) {
            var points = strokes[s]['pt'];
            var prev_x = 0, prev_y = 0;
            for (var p in points) {
                // i ++;
                if (!prev_x && !prev_y) {
                    prev_x = points[p]['x'] - 0.5;
                    prev_y = points[p]['y'] - 0.5;
                } else {
                    var x = points[p]['x'] - 0.5,
                        y = points[p]['y'] - 0.5,
                        time = points[p]['time'] * 1000;

                        // console.info(prev_x,prev_y,x,y);
                        setTimeout((function(_prev_x,_prev_y,_x,_y, _time){
                            return function(){
                                scene.add(new Block(_prev_x,_prev_y,_x,_y, _time).cube);
                                renderer.render(scene,camera);
                            }
                        })(prev_x,prev_y,x,y,time), time);

                        prev_x = x;
                        prev_y = y;

                        if (time) last_time = time;
                }
            }

        }
    } else {
        console.info('GML not downloaded yet....');
    }
    setTimeout(function(){callback();}, parseInt(last_time + 0.5));
}



// Block object that spans between two points.
function Block(_x1,_y1,_x2,_y2,_time) {
    var scaleVal = 300;
    this.x1 = _x1 * scaleVal;
    this.y1 = _y1 * scaleVal;
    this.x2 = _x2 * scaleVal;
    this.y2 = _y2 * scaleVal;
    this.delay = _time;

    this.height = dist(this.x1,this.y1,this.x2,this.y2);
    if (this.height < 3) this.height = 3;
    // this.width = this.depth = 5;
    this.depth = scaleVal / (this.height + 5);
    this.width = this.depth * .6;
    
    this.anglez = this.x1 - this.x2 ? Math.atan((this.y1 - this.y2) / (this.x1 - this.x2)) : Math.atan((this.y1 - this.y2) / 0.000000001);

    // console.log(this.height, this.anglez, [this.x1, this.y1], [this.x2, this.y2], [(this.x1 - this.x2) / 2 + this.x2, (this.y1 - this.y2) / 2 + this.y2], (1 / (this.height + 50)));

    var sphereMaterial = new THREE.MeshBasicMaterial({color:get_random_color()});
    // var sphereMaterial = new THREE.MeshBasicMaterial({color:0x000000});

    this.cube = new THREE.Mesh(
        new THREE.CubeGeometry(this.width,this.height,this.depth,1,1,1, sphereMaterial),
        new THREE.MeshFaceMaterial());
    var x = (this.y1 - this.y2) / 2 + this.y2;
    var y = (this.x1 - this.x2) / 2 + this.x2;
    this.cube.position.set(x * 1.5,y * 1.5,Z);
    // this.cube.position.x = (this.y1 - this.y2) / 2 + this.y2;
    // this.cube.position.z = Z;
    // this.cube.rotation.x = Math.random() * .3;
    // this.cube.rotation.y = Math.random() * .3;
    // this.cube.rotation.x = Math.random() * Math.PI;
    // this.cube.rotation.y = Math.random() * Math.PI;
    // this.cube.rotation.z = -this.anglez;
    this.cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, -this.anglez);

    Z += 0.1;
    // camera.position.z += 1;
    camera.lookAt(x,y,Z);
}


// get distance between two points
function dist(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

// get random color like 0xFF0000
function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '0x';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}







