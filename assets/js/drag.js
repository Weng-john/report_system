$('input[type="button"]').each(function(){
    $('input[type="button"]').prop("draggable", true);
    this.addEventListener('dragstart', dargStart);
    this.addEventListener('dragend', dragEnd);
});

$("[data-role='drag-drop-countainer']").each(function(){
    this.addEventListener('dragenter', dragEnter);
    this.addEventListener('dragover', dragOver);
    this.addEventListener('dragleave', dragLeave);
    this.addEventListener('drop', Drop);
});

function dargStart(e){
    e.dataTransfer.setData('text/plain', e.target.id);
    $("#selected").addClass("target");
}

function dragEnd(e){
    $("#selected").removeClass("target");
}

function dragEnter(e){
    cancelDefault(e);
}

function dragOver(e){
    cancelDefault(e);
}

function dragLeave(e){
    cancelDefault(e);
}

function Drop(e){
    cancelDefault(e);
    var dragId = e.dataTransfer.getData('text/plain');
    
    var triNode= e.target;
    if(triNode.className==="color")
        triNode= triNode.parentNode;
    
    var posY= [];
    var orderCol= triNode.childNodes;
    var mousePos= getMousePos() - $(triNode).offset().top;
    orderCol.forEach(function(item){
        if(item.tagName==="INPUT"){
            posY.push({
                Node: item,
                position: (item.offsetTop + item.offsetHeight/2)
            });
        }
    });
    var setted= false;
    posY.forEach(function(pos){
        if(setted)
            return;
        if(mousePos<pos.position){
            setted= true;
            pos.Node.before(document.getElementById(dragId));
            triNode.classList.add("shadow");
            setTimeout(function(){
                triNode.classList.remove("shadow");
            },1000);
        }
    });
    if(!setted){
        triNode.appendChild(document.getElementById(dragId))
        triNode.classList.add("shadow");
        setTimeout(function(){
            triNode.classList.remove("shadow");
        },1000);
    }
}

function cancelDefault(e){
  e.preventDefault();
  e.stopPropagation();
  return;
}

function getMousePos(event) {
       var e = event || window.event;
       var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
       var y = e.pageY || e.clientY + scrollY;
       //alert('x: ' + x + '\ny: ' + y);
       return y;
}