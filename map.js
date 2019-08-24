addToDOM = function(){   
    var self = this,
        view = self.getView(),   
        style = view.style;
    document.body.appendChild(view); //将组件底层div添加到body中           
    style.left = '0';//默认组件是绝对定位，所以要设置位置
    style.right = '0';
    style.top = '0';
    style.bottom = '0';      
    window.addEventListener('resize', function () { self.iv(); }, false); //窗口变化事件           
}

mark_Point13 = [];//线路 数组内包含线路的起点和终点坐标以及这条线路的名称
t_Point13 = [];//换成站点 数组内包含线路中的换乘站点坐标以及换成站点名称
n_Point13 = [];//小站点 数组内包含线路中的小站点坐标以及小站点名称
mark_Point13.push({ name: '十三号线', value: [113.4973,23.1095]}); 
mark_Point13.push({ name: '十三号线', value: [113.4155,23.1080]}); 
t_Point13.push({ name: '鱼珠', value: [113.41548,23.10547]}); 
n_Point13.push({ name: '裕丰围', value: [113.41548,23.10004]});

var lineNum = ['1', '2', '3', '30', '4', '5', '6', '7', '8', '9', '13', '14', '32', '18', '21', '22', '60', '68'];
var color = ['#f1cd44', '#0060a1', '#ed9b4f', '#ed9b4f', '#007e3a', '#cb0447', '#7a1a57', '#18472c', '#008193', '#83c39e', '#8a8c29', '#82352b', '#82352b', '#09a1e0', '#8a8c29', '#82352b', '#b6d300', '#09a1e0'];

let lineName = 'Line' + num;
let line = window[lineName];

function createLine(num, color) {//绘制地图线
    var polyline = new ht.Polyline();//多边形 管线
    polyline.setTag(num);//设置节点tag标签，作为唯一标示
    
    if(num === '68') polyline.setToolTip('A P M');//设置提示信息 
    else if(num === '60') polyline.setToolTip('G F'); 
    else polyline.setToolTip('Line' + num);

    if(color) {
        polyline.s({//s 为 setStyle 的简写，设置样式
            'shape.border.width': 0.4,//设置多边形的边框宽度
            'shape.border.color': color,//设置多边形的边框颜色
            'select.width': 0.2,//设置选中节点的边框宽度
            'select.color': color//设置选中节点的边框颜色
        });
    }

    let lineName = 'Line' + num;
    let line = window[lineName];
    for(let i = 0; i < line.length; i++) {
        for(let j = 0; j < line[i].coords.length; j++) {
            polyline.addPoint({x: line[i].coords[j][0]*300, y: -line[i].coords[j][1]*300});
            if(num === '68'){//APM线（有两条，但是点是在同一个数组中的）
                if(i === 0 && j === 0) {
                    polyline.setSegments([1]);
                }
                else if(i === 1 && j === 0) {
                    polyline.getSegments().push(1);
                }
                else {
                    polyline.getSegments().push(2);
                }
            }    
        }
    }

    polyline.setLayer('0');//将线设置在下层，点设置在上层“top”
    dm.add(polyline);//将管线添加进数据容器中储存，不然这个管线属于“游离”状态，是不会显示在拓扑图上的
    return polyline;
}

var tName = 't_Point' + num;
var tP = window[tName];//大站点
if(tP) {//有些线路没有“换乘站点”
    for(let i = 0; i < tP.length; i++) {
        let node = createNode(tP[i].name, tP[i].value, color[index]);//在获取的线路上的点的坐标位置添加节点
        node.s({//设置节点的样式style
            'label.scale': 0.05,//文本缩放，可以避免浏览器限制的最小字号问题
            'label.font': 'bold 12px arial, sans-serif'//设置文本的font
        });
        node.setSize(0.6, 0.6);//设置节点大小。由于js中每个点之间的偏移量太小，所以我不得不把节点设置小一些
        node.setImage('images/旋转箭头.json');//设置节点的图片
        node.a('alarmColor1', 'rgb(150, 150, 150)');//attr属性，可以在这里面设置任何的东西，alarmColor1是在上面设置的image的json中绑定的属性，具体参看 HT for Web 矢量手册(http://www.hightopo.com/guide/guide/core/vector/ht-vector-guide.html#ref_binding)
        node.a('alarmColor2', 'rgb(150, 150, 150)');//同上
        node.a('tpNode', true);//这个属性设置只是为了用来区分“换乘站点”和“小站点”的，后面会用上
    }
}

gv.fitContent(false, 0.00001);//自适应大小，参数1为是否动画，参数2为gv与边框的padding值
gv.setMovableFunc(function(){
    return false;//设置gv上的节点不可移动
});
