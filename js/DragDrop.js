(function () {
    var dragSrcEl = null;

    function handleDragStart(e) {
        dragSrcEl = this;
        console.log(dragSrcEl);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.outerHTML);
    }

    var cols = document.querySelectorAll('.dimention-class');
    [].forEach.call(cols, function (col) {
        col.addEventListener('dragstart', handleDragStart, false);
    });

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault(); 
        }

        e.dataTransfer.dropEffect = 'move';  

        return false;
    }

    function handleDragEnter(e) {
        this.classList.add('over');
    }

    function handleDragLeave(e) {
        this.classList.remove('over');  
    }

    function handleDrop(e) {

        if (e.stopPropagation) {
            e.stopPropagation(); 
        }

        if (dragSrcEl != this) {
           

            var ulNodes = this.getElementsByTagName('ul');
            var ul = document.createElement('ul');
            ul.innerHTML = e.dataTransfer.getData('text/plain');
            var li =ul.firstChild;
            if(checkClass(this,li)){
                li.addEventListener('dragstart', handleDragStart, false);
                ulNodes.item(0).appendChild(li);
                dragSrcEl.outerHTML = null;
            }
            
        }

        return false;
    }

    function handleDragEnd(e) {

        [].forEach.call(cols, function (col) {
            col.classList.remove('over');
        });
    }

    function checkClass(parent ,child){
        var parentClassList = parent.classList;
        var childClassList  = child.classList;
        for(var i in childClassList){
            if(parentClassList.contains(childClassList[i])){
                return true;
            }
        }
        return false;
    }

    var colls = document.querySelectorAll('.landing-zone');
    [].forEach.call(colls, function (coll) {
        coll.addEventListener('dragenter', handleDragEnter, false)
        coll.addEventListener('dragover', handleDragOver, false);
        coll.addEventListener('dragleave', handleDragLeave, false);
        coll.addEventListener('drop', handleDrop, false);
        coll.addEventListener('dragend', handleDragEnd, false);
    });

})();