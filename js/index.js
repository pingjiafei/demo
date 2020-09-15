/* 1. 通过js 创建125个li */
(function(){
    let oList = document.getElementById("list");
    // 提前写好就可以了
    let grid = function (index){
        //求坐标
        let x = index % 5 ;// 除以5的余数
        let y = Math.floor(index%25/5 ); //除以5的余数, 满25 ,重新排列,
        let z = Math.floor(index/25);
        // 位移-方向
        let xx = x-2;
        let yy = y-2;
        let zz = 2-z;
        // 开始位置
        return `transform: translate3d(${xx*240}px,${yy*240}px,${zz*800}px);`;
    };
    let helix = (function(){
        let deg = 360/(125/4)
        return function(index){
            return `transform: rotateY(${index*deg}deg) translate3d(0px,${(index-62)*10}px,1000px);`;
        }
    })();
    let sphere = (function(){
        let arr = [1,3,7,9,11,14,21,16,12,10,9,7,4,1];
        let len = arr.length;
        let xdg = 180/(len-1);
        return function(index){
            let turns ,num ;
            let  sum = 0;
            // 通过序号求出当前li属于第几圈的第几个
            for (let i =0 ;i < len ; i++){
                sum += arr[i];
                if (sum >= (index+1)){
                    // 当前元素在 第i圈 ,i序号
                    turns = i;
                    // 当前元素在第i圈的第几个 倒数
                    num = sum-(index+1);
                    break;
                }
            }
            let xDeg = 90-turns*xdg;
            let yDeg = 360/arr[turns]*num +arr[turns]*10;
            return `transform: rotateY(${yDeg}deg) rotateX(${xDeg}deg)  translateZ(900px)`;
        }

    })();
    let table =(function(){
        let coord = [
            {x:0,y:0},
            {x:17,y:0},
            {x:0,y:1},
            {x:1,y:1},
            {x:12,y:1},
            {x:13,y:1},
            {x:14,y:1},
            {x:15,y:1},
            {x:16,y:1},
            {x:17,y:1},
            {x:0,y:2},
            {x:1,y:2},
            {x:12,y:2},
            {x:13,y:2},
            {x:14,y:2},
            {x:15,y:2},
            {x:16,y:2},
            {x:17,y:2}
        ];
        return function (index){
            let x,y;
            if (index < 18 ){
                x = coord[index].x;
                y = coord[index].y;
            }else if ( index < 90 ){
                x = index % 18 ;
                y = Math.floor( index /18 )+2;
            }else if (index < 105 ){
                x = index % 18 + 1.5;
                y = Math.floor( index /18 )+2;
            }else if (index < 120){
                x = (index + 3)% 18 + 1.5;
                y = Math.floor( (index + 3) /18 )+2;
            }else{  // 对余的五个 叠加到某一个坐标
                x = 17;
                y = 6;
            }
            // x,y的变化量
            let x_ = x - 8.5;
            let y_ = y - 4;
            // 开始位置
            return `transform:translate(${x_*160}px,${y_*200}px);`;
        }
    })();

    // 模块1 -- 创建125 个 li
    (function(){
        let oStyle = document.getElementById("style");
        let styleText = "";
        let fragment = document.createDocumentFragment();
        for (let i = 0; i <125 ; i++) {
            let ranX = Math.floor(Math.random()*8000-5000);
            let ranY = Math.floor(Math.random()*8000-5000);
            let ranZ = Math.floor(Math.random()*10000-5000);

            // 120 -- 125 还差 5 需要默认填补一样的
            let d = data[i] || {"order":"103","name":"Lr","mass":"(260)"};
            let oLi = document.createElement("li");
            oLi.innerHTML = `
                <p>${d.order}</p>
                <p>${d.name}</p>
                <p>${d.mass}</p>
            `;
            fragment.appendChild(oLi);
            // 先把所有li所需要的css样式写好
            styleText += `
                #cont ul.beg li:nth-child(${i+1}){ 
                    transform:translate3d(${ranX}px,${ranY}px,${ranZ}px);
                }
                #cont ul.grid li:nth-child(${i+1}){ ${grid(i)}}
                #cont ul.helix li:nth-child(${i+1}){ ${helix(i)}}
                #cont ul.sphere li:nth-child(${i+1}){ ${sphere(i)}}
                #cont ul.table li:nth-child(${i+1}){ ${table(i)}}
            `;

        }
        // 将写好的样式放入页面当中
        oStyle.innerHTML = styleText;
        oList.appendChild(fragment);
        oList.offsetLeft;
        // 改变 ul的名字,达到改变li的样式
        oList.className ="grid";
    })();
    // 鼠标事件
    (function(){
        // 获取 ul的初始位置
        // 旋转初始值
        let rX = 0,
            rY = 0,
            rZ = -2000;
        // 鼠标拖拽
        (function(){
            let sX,sY,nX,nY,sRotX,sRotY,nRotY ,nRotX,xx,yy,lastX,lastY,SX=0,SY=0,timer ,moveTimer=0;
            document.addEventListener("mousedown",function(e){
                cancelAnimationFrame(timer);
                // 记录位置
                sX = e.pageX;
                sY = e.pageY;
                sRotX = rX;
                sRotY = rY;
                this.addEventListener("mousemove",move);
            });
            document.addEventListener("mouseup",function(e){
                this.removeEventListener("mousemove",move);
                // 抬起和最后一次的move 时间相差较大 -- 不要有动画了
                if (new Date - moveTimer > 100 )return;
                timer = requestAnimationFrame(m);
                function m(){
                    SX *=0.95;
                    SY *=0.95;
                    rY +=SX*0.1;
                    rX -=SY*0.1;
                    nRotY = sRotY + xx*0.1;
                    nRotX = sRotX + yy*0.1;
                    oList.style.transform = `translateZ(${rZ}px) rotateX(${rX}deg) rotateY(${rY}deg)`;
                    if (Math.abs(SX) <= 0.5 && Math.abs(SY)<=0.5)return ; // 达到这条件就不执行
                    timer =  requestAnimationFrame(m);
                }
            });
            function move(e){
                moveTimer = new Date;
                nX = e.pageX;
                nY = e.pageY;
                // 计算变化量
                xx = nX - sX;
                yy = nY - sY;
                // 角度值的变换: 按下时候,总的变化角度
                nRotY = sRotY + xx*0.1;
                nRotX = sRotX + yy*0.1;
                // 每次改变,重新记录值
                rX = nRotX;
                rY = nRotY;
                // 改变样式

                oList.style.transform = `translateZ(${rZ}px) rotateX(${nRotX}deg) rotateY(${nRotY}deg)`;

                // 求出最后两点之间的距离
                SX = nX - lastX;
                SY = nY - lastY;

                // 存储当前鼠标的坐标
                lastX = nX;
                lastY = nY;

                /*惯性的测试*/
               /* let div = document.createElement("div");
                div.style.cssText = "width:5px;height:5px;background:yellow;position:fixed;top:"+nY+"px;left:"+nX+"px;";
                document.body.appendChild(div);*/

            }
        })();
        // 滚轮事件-放大缩小
        (function(){
            // 火狐的鼠标滚动事件 e.detail -- 3 上滚负值
            document.addEventListener("DOMMouseScroll",wheel);
            // 谷歌的滚动事件 e.wheelDelta --120 上滚正值
            document.addEventListener("mousewheel",wheel);
            function wheel(e){
               let d = e.detail/3 || e.wheelDelta/120;
                // d 子带正负号
                rZ += d*200;

                rZ = Math.max(rZ,-6500);
                rZ = Math.min(rZ,600);

                oList.style.transform = `translateZ(${rZ}px) rotateX(${rX}deg) rotateY(${rY}deg)`;
            }
        })();
    })();
    // tab 点击事件
    (function(){
        let oTabLi = document.querySelectorAll("#tab li");
        oTabLi.forEach(node=>{
            node.onclick = function(){
                oList.className = this.innerHTML;
            }
        })
    })();

})();