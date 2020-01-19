import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import {
  isAny,
  is
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

export default function(group, element) {
  
  //displays the ScopeID in the situation tab
  if(isAny(element, ['bpmn:SubProcess']) && element.businessObject.suitable >0){
	  group.entries.push(entryFactory.textField({
      id : 'scope',
      description : 'ID der Scope zu der gesprungen wird',
      label : 'Scope ID',
      modelProperty : 'scope'
	  }))
  }

  // Only return an entry, if the currently selected
  // element is one of these types.
  if (isAny(element, [
      'bpmn:IntermediateThrowEvent',
      'bpmn:IntermediateCatchEvent', 'bpmn:BoundaryEvent' ])&& element.businessObject.suitable >0) {
    
    group.entries.push({
      html: '<img src="Batterie.jpg" width="25">',
      id : 'icon'
    }),
    group.entries.push(entryFactory.textField({
      id : 'violation',
      description : 'Wenn Situation verletzt wird, springe zu Scope ID.',
      label : 'Akku-Violation',
      modelProperty : 'violation',
      validate: function(element, values) {
        var violation = values.violation;
        var errorMessageV = {};
        if(element.businessObject.attachedToRef.$type == 'bpmn:SubProcess'&&
         element.businessObject.attachedToRef.suitable == 100){

        // Typ
        //console.log(element.businessObject.attachedToRef.$type);
        // über alle durch bis children = attachers
        // Index vom aktuellen Element
        var find;

        var kind;
        var li;
        // woran es drangeklebt ist
        // element.parent.children[0].attachers[0].host
        //console.log(element.parent.children[0]);
        //console.log(element.id);
        for(var k = 0; k < element.parent.children.length-1; k++){
          for(var l = 0; l < element.parent.children[k].attachers.length; l++){
            for(var m = 0; m < element.parent.children[k].attachers[l].host.attachers.length; m++){
            if(element.parent.children[k].attachers[l].host.attachers[m].id == element.id){
                kind = k;
                li = l;
                find = m;
            }
            }
          }

        }

        //console.log(element.parent.children[0].attachers[0].host.id);
        //console.log(element.parent.children.length);
        //for(var i = 0; i<element.parent.children.length-1; i++){
          //if(element.parent.children[0].attachers[0].host.attachers[i].id == element.id){
            //  find = i;
          //}
       // }

        //console.log("find"+find);
        //console.log(element.parent.children[0].attachers[0].host.attachers[i].violation);
        
        var onlyChild = false;
        //console.log("length"+ element.parent.children.length);
        if(element.parent.children.length-1 == 1){
               onlyChild = true;
               //console.log(onlyChild);
        }
        console.log(values);
        
        
        //console.log(element.parent.children);
        if (isNaN(violation) && !String(violation).match(/^[0-9]([a-z0-9]+)*$/)) {
          errorMessageV.violation = "Nicht valide Eingabe, da violation mit Zahl beginnen muss.";
          delete element.businessObject.$attrs.violation; 
        }

        if(violation < 0){
          errorMessageV.violation = "violation darf nicht kleiner 0 sein.";
          delete element.businessObject.$attrs.violation; 
        }

        if(!onlyChild){ 
          for(var i = 0; i<element.parent.children[kind].attachers[li].host.attachers.length; i++){
            // gibt violation vom anderen Kreis aus
            if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.id != element.id){
              if (String(violation).match(/^[0-9]+$/)) {
                if((!isNaN(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation) || String(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation).match(/^[0-9]([a-z0-9]+)*$/)) && element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation != '' ){
              
            //if((Number(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation) >= 0 && Number(violation) >= 0)) {
              errorMessageV.violation = "violation darf nicht gesetzt werden, da sie bereits in einem anderen Kreis gesetzt wurde.";
              delete element.businessObject.$attrs.violation; 
              //delete element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation;
            //}
          }}
            if (String(violation).match(/^[0-9]([a-z0-9]+)*$/) && !(String(violation).match(/^[0-9]+$/))) {
             
              if((!isNaN(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation) 
              || String(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation).match(/^[0-9]([a-z0-9]+)*$/)) 
              && element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation != '' ){
              errorMessageV.violation = "violation darf nicht gesetzt werden, da sie bereits in einem anderen Kreis gesetzt wurde.";
              delete element.businessObject.$attrs.violation; 
              //delete element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation;
              
            }
          }

          }
        }
      }
        return errorMessageV;
      }
    }})),
    group.entries.push(entryFactory.textField({
      id : 'prioritaet',
      description : 'Priorität',
      label : 'Akku-Priorität',
      modelProperty : 'prioritaet',
      validate: function(element, values) {
        var prioritaet = values.prioritaet;
        var errorMessageP = {};
        if(element.businessObject.$attrs.violation == undefined){
          errorMessageP.prioritaet = "Setze zuerst violation Attribut.";
          delete element.businessObject.$attrs.prioritaet;
        }

        if (isNaN(prioritaet)) {
          errorMessageP.prioritaet = "Priorität muss eine Nummmer sein.";
          delete element.businessObject.$attrs.prioritaet;
        }

        if(element.businessObject.attachedToRef.$type == 'bpmn:SubProcess'&&
           element.businessObject.attachedToRef.suitable == 100){
           // Index vom aktuellen Element
            var find;

            var kind;
            var li;
            for(var k = 0; k < element.parent.children.length-1; k++){
              for(var l = 0; l < element.parent.children[k].attachers.length; l++){
                for(var m = 0; m < element.parent.children[k].attachers[l].host.attachers.length; m++){
                  if(element.parent.children[k].attachers[l].host.attachers[m].id == element.id){
                    kind = k;
                    li = l;
                    find = m;
                  }
                }
               }
            }

        var onlyChild = false;
        if(element.parent.children.length-1 == 1){
               onlyChild = true;
        }

        if(prioritaet < 0){
          errorMessageP.prioritaet = "Priorität darf nicht kleiner 0 sein.";
          delete element.businessObject.$attrs.prioritaet;
        }

        if(!onlyChild){ 
          for(var i = 0; i < element.parent.children[kind].attachers[li].host.attachers.length; i++){
            // gibt prioritaet vom anderen Kreis aus
            if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.id != element.id){
              if((element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.prioritaet >= 0 && prioritaet >= 0)) {
                errorMessageP.prioritaet = "Priorität darf nicht gesetzt werden, da sie bereits in einem anderen Kreis gesetzt wurde.";
                delete element.businessObject.$attrs.prioritaet;
              }
            }
          }
        }
        return errorMessageP;
      }}
  })),
  group.entries.push({
    html: '<img src="spider.png" width="25">',
    id : 'icon2'
  }),
  group.entries.push(entryFactory.textField({
    id : 'violation2',
    description : 'Wenn Situation verletzt wird, springe zu Scope ID.',
    label : 'Spinne-Violation',
    modelProperty : 'violation2',
    validate: function(element, values) {
      var violation2 = values.violation2;
      var errorMessageV = {};
      if(element.businessObject.attachedToRef.$type == 'bpmn:SubProcess'&&
       element.businessObject.attachedToRef.suitable == 100){

        
      // Typ
      //console.log(element.businessObject.attachedToRef.$type);
      // über alle durch bis children = attachers
      // Index vom aktuellen Element
      var find;

      var kind;
      var li;
      // woran es drangeklebt ist
      // element.parent.children[0].attachers[0].host
      //console.log(element.parent.children[0]);
      //console.log(element.id);
      for(var k = 0; k < element.parent.children.length-1; k++){
        for(var l = 0; l < element.parent.children[k].attachers.length; l++){
          for(var m = 0; m < element.parent.children[k].attachers[l].host.attachers.length; m++){
          if(element.parent.children[k].attachers[l].host.attachers[m].id == element.id){
              kind = k;
              li = l;
              find = m;
          }
          }
        }

      }

      //console.log(element.parent.children[0].attachers[0].host.id);
      //console.log(element.parent.children.length);
      //for(var i = 0; i<element.parent.children.length-1; i++){
        //if(element.parent.children[0].attachers[0].host.attachers[i].id == element.id){
          //  find = i;
        //}
     // }

      //console.log("find"+find);
      //console.log(element.parent.children[0].attachers[0].host.attachers[i].violation);
      
      var onlyChild = false;
      //console.log("length"+ element.parent.children.length);
      if(element.parent.children.length-1 == 1){
             onlyChild = true;
             //console.log(onlyChild);
      }
      
      //console.log(element.parent.children);
      if (isNaN(violation2) && !String(violation2).match(/^[0-9]([a-z0-9]+)*$/)) {
        errorMessageV.violation2 = "Nicht valide Eingabe, da violation mit Zahl beginnen muss.";
        delete element.businessObject.$attrs.violation2;
      }

      if(violation2 < 0){
        errorMessageV.violation2 = "violation darf nicht kleiner 0 sein.";
        delete element.businessObject.$attrs.violation2;
      }

      if(!onlyChild){ 
        for(var i = 0; i<element.parent.children[kind].attachers[li].host.attachers.length; i++){
          // gibt violation vom anderen Kreis aus
          if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.id != element.id){
            if (String(violation2).match(/^[0-9]+$/)) {
              if((!isNaN(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation2) 
              || String(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation2).match(/^[0-9]([a-z0-9]+)*$/))
               && element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation2 != '' ){
            
          //if((Number(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation) >= 0 && Number(violation) >= 0)) {
            errorMessageV.violation2 = "violation darf nicht gesetzt werden, da sie bereits in einem anderen Kreis gesetzt wurde.";
            delete element.businessObject.$attrs.violation2;
          //}
        }}
          if (String(violation2).match(/^[0-9]([a-z0-9]+)*$/) && !(String(violation2).match(/^[0-9]+$/))) {
           
            if((!isNaN(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation2) 
            || String(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation2).match(/^[0-9]([a-z0-9]+)*$/)) 
            && element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation2 != '' ){
            errorMessageV.violation2 = "violation darf nicht gesetzt werden, da sie bereits in einem anderen Kreis gesetzt wurde.";
            delete element.businessObject.$attrs.violation2;
          }
        }

        }
      }
    }
      return errorMessageV;
    }
  }})),
  group.entries.push(entryFactory.textField({
    id : 'prioritaet2',
    description : 'Priorität',
    label : 'Spinne-Priorität',
    modelProperty : 'prioritaet2',
    validate: function(element, values) {
    var prioritaet2 = values.prioritaet2;
    var errorMessageP = {};
    if(element.businessObject.$attrs.violation2 == undefined){
      errorMessageP.prioritaet2 = "Setze zuerst violation Attribut.";
      delete element.businessObject.$attrs.prioritaet2;
    }

    if (isNaN(prioritaet2)) {
      errorMessageP.prioritaet2 = "Priorität muss eine Nummmer sein.";
      delete element.businessObject.$attrs.prioritaet2;
    }

    if(element.businessObject.attachedToRef.$type == 'bpmn:SubProcess'&&
        element.businessObject.attachedToRef.suitable == 100){
        // Index vom aktuellen Element
        var find;

        var kind;
        var li;
        for(var k = 0; k < element.parent.children.length-1; k++){
          for(var l = 0; l < element.parent.children[k].attachers.length; l++){
            for(var m = 0; m < element.parent.children[k].attachers[l].host.attachers.length; m++){
            if(element.parent.children[k].attachers[l].host.attachers[m].id == element.id){
                kind = k;
                li = l;
                find = m;
            }
            }
          }

        }

        
        var onlyChild = false;
        if(element.parent.children.length-1 == 1){
               onlyChild = true;
        }

        if(prioritaet2 < 0){
          errorMessageP.prioritaet2 = "Priorität darf nicht kleiner 0 sein.";
          delete element.businessObject.$attrs.prioritaet2;
        }

        if(!onlyChild){ 
          for(var i = 0; i<element.parent.children[kind].attachers[li].host.attachers.length; i++){
            // gibt violation vom anderen Kreis aus
            if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.id != element.id){
            if((element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.prioritaet2 >= 0 && prioritaet2 >= 0)) {
              errorMessageP.prioritaet2 = "Priorität darf nicht gesetzt werden, da sie bereits in einem anderen Kreis gesetzt wurde.";
              delete element.businessObject.$attrs.prioritaet2;
            }
          }
        }
      }
        return errorMessageP;
      }}
})),
  group.entries.push({
    html: '<img src="human.png" width="35">',
    id : 'icon3'
  }),
  group.entries.push(entryFactory.textField({
    id : 'violation3',
    description : 'Wenn Situation verletzt wird, springe zu Scope ID.',
    label : 'Mensch-Violation',
    modelProperty : 'violation3',
    validate: function(element, values) {
      var violation3 = values.violation3;
        var errorMessageV = {};
        if(element.businessObject.attachedToRef.$type == 'bpmn:SubProcess'&&
         element.businessObject.attachedToRef.suitable == 100){

        // Typ
        //console.log(element.businessObject.attachedToRef.$type);
        // über alle durch bis children = attachers
        // Index vom aktuellen Element
        var find;

        var kind;
        var li;
        // woran es drangeklebt ist
        // element.parent.children[0].attachers[0].host
        //console.log(element.parent.children[0]);
        //console.log(element.id);
        for(var k = 0; k < element.parent.children.length-1; k++){
          for(var l = 0; l < element.parent.children[k].attachers.length; l++){
            for(var m = 0; m < element.parent.children[k].attachers[l].host.attachers.length; m++){
            if(element.parent.children[k].attachers[l].host.attachers[m].id == element.id){
                kind = k;
                li = l;
                find = m;
            }
            }
          }

        }

        //console.log(element.parent.children[0].attachers[0].host.id);
        //console.log(element.parent.children.length);
        //for(var i = 0; i<element.parent.children.length-1; i++){
          //if(element.parent.children[0].attachers[0].host.attachers[i].id == element.id){
            //  find = i;
          //}
       // }

        //console.log("find"+find);
        //console.log(element.parent.children[0].attachers[0].host.attachers[i].violation);
        
        var onlyChild = false;
        //console.log("length"+ element.parent.children.length);
        if(element.parent.children.length-1 == 1){
               onlyChild = true;
               //console.log(onlyChild);
        }
        
        //console.log(element.parent.children);
        if (isNaN(violation3) && !String(violation3).match(/^[0-9]([a-z0-9]+)*$/)) {
          errorMessageV.violation3 = "Nicht valide Eingabe, da violation mit Zahl beginnen muss.";
          delete element.businessObject.$attrs.violation3;
        }

        if(violation3 < 0){
          errorMessageV.violation3 = "violation darf nicht kleiner 0 sein.";
          delete element.businessObject.$attrs.violation3;
        }

        if(!onlyChild){ 
          for(var i = 0; i<element.parent.children[kind].attachers[li].host.attachers.length; i++){
            // gibt violation vom anderen Kreis aus
            if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.id != element.id){
              if (String(violation3).match(/^[0-9]+$/)) {
                if((!isNaN(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation3) 
                || String(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation3).match(/^[0-9]([a-z0-9]+)*$/)) 
                && element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation3 != '' ){
              
            //if((Number(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation) >= 0 && Number(violation) >= 0)) {
              errorMessageV.violation3 = "violation darf nicht gesetzt werden, da sie bereits in einem anderen Kreis gesetzt wurde.";
              delete element.businessObject.$attrs.violation3;
            //}
          }}
            if (String(violation3).match(/^[0-9]([a-z0-9]+)*$/) && !(String(violation3).match(/^[0-9]+$/))) {
             
              if((!isNaN(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation3) 
              || String(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation3).match(/^[0-9]([a-z0-9]+)*$/)) 
              && element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation3 != '' ){
              errorMessageV.violation3 = "violation darf nicht gesetzt werden, da sie bereits in einem anderen Kreis gesetzt wurde.";
              delete element.businessObject.$attrs.violation3;
            }
          }

          }
        }
      }
        return errorMessageV;
      }}
  })),
  group.entries.push(entryFactory.textField({
    id : 'prioritaet3',
    description : 'Priorität',
    label : 'Mensch-Priorität',
    modelProperty : 'prioritaet3',
    validate: function(element, values) {
    var prioritaet3 = values.prioritaet3;
    var errorMessageP = {};
    if(element.businessObject.$attrs.violation3 == undefined){
      errorMessageP.prioritaet3 = "Setze zuerst violation Attribut.";
      delete element.businessObject.$attrs.prioritaet3;
    }

    if (isNaN(prioritaet3)) {
      errorMessageP.prioritaet3 = "Priorität muss eine Nummmer sein.";
      delete element.businessObject.$attrs.prioritaet3;
    }

    if(element.businessObject.attachedToRef.$type == 'bpmn:SubProcess'&&
        element.businessObject.attachedToRef.suitable == 100){
        // Index vom aktuellen Element
        var find;

        var kind;
        var li;
        for(var k = 0; k < element.parent.children.length-1; k++){
          for(var l = 0; l < element.parent.children[k].attachers.length; l++){
            for(var m = 0; m < element.parent.children[k].attachers[l].host.attachers.length; m++){
            if(element.parent.children[k].attachers[l].host.attachers[m].id == element.id){
                kind = k;
                li = l;
                find = m;
            }
            }
          }

        }

        
        var onlyChild = false;
        if(element.parent.children.length-1 == 1){
               onlyChild = true;
        }
        //console.log(element.parent.children);
        if(prioritaet3 < 0){
          errorMessageP.prioritaet3 = "Priorität darf nicht kleiner 0 sein.";
          delete element.businessObject.$attrs.prioritaet3;
        }

        if(!onlyChild){ 
          for(var i = 0; i<element.parent.children[kind].attachers[li].host.attachers.length; i++){
            // gibt violation vom anderen Kreis aus
            if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.id != element.id){
            if((element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.prioritaet3 >= 0 && prioritaet3 >= 0)) {
              errorMessageP.prioritaet3 = "Priorität darf nicht gesetzt werden, da sie bereits in einem anderen Kreis gesetzt wurde.";
              delete element.businessObject.$attrs.prioritaet3;
            }
          }
        }
      }
        return errorMessageP;
      }}
})),
group.entries.push({
  html: '<img src="kamera.png" width="35">',
  id : 'icon4'
}),
group.entries.push(entryFactory.textField({
  id : 'violation4',
  description : 'Wenn Situation verletzt wird, springe zu Scope ID.',
  label : 'Kamera-Violation',
  modelProperty : 'violation4',
  validate: function(element, values) {
    var violation4 = values.violation4;
        var errorMessageV = {};
        if(element.businessObject.attachedToRef.$type == 'bpmn:SubProcess'&&
         element.businessObject.attachedToRef.suitable == 100){

        // Typ
        //console.log(element.businessObject.attachedToRef.$type);
        // über alle durch bis children = attachers
        // Index vom aktuellen Element
        var find;

        var kind;
        var li;
        // woran es drangeklebt ist
        // element.parent.children[0].attachers[0].host
        //console.log(element.parent.children[0]);
        //console.log(element.id);
        for(var k = 0; k < element.parent.children.length-1; k++){
          for(var l = 0; l < element.parent.children[k].attachers.length; l++){
            for(var m = 0; m < element.parent.children[k].attachers[l].host.attachers.length; m++){
            if(element.parent.children[k].attachers[l].host.attachers[m].id == element.id){
                kind = k;
                li = l;
                find = m;
            }
            }
          }

        }

        //console.log(element.parent.children[0].attachers[0].host.id);
        //console.log(element.parent.children.length);
        //for(var i = 0; i<element.parent.children.length-1; i++){
          //if(element.parent.children[0].attachers[0].host.attachers[i].id == element.id){
            //  find = i;
          //}
       // }

        //console.log("find"+find);
        //console.log(element.parent.children[0].attachers[0].host.attachers[i].violation);
        
        var onlyChild = false;
        //console.log("length"+ element.parent.children.length);
        if(element.parent.children.length-1 == 1){
               onlyChild = true;
               //console.log(onlyChild);
        }
        
        //console.log(element.parent.children);
        if (isNaN(violation4) && !String(violation4).match(/^[0-9]([a-z0-9]+)*$/)) {
          errorMessageV.violation4 = "Nicht valide Eingabe, da violation mit Zahl beginnen muss.";
          delete element.businessObject.$attrs.violation4;
        }

        if(violation4 < 0){
          errorMessageV.violation4 = "violation darf nicht kleiner 0 sein.";
          delete element.businessObject.$attrs.violation4;
        }

        if(!onlyChild){ 
          for(var i = 0; i<element.parent.children[kind].attachers[li].host.attachers.length; i++){
            // gibt violation vom anderen Kreis aus
            if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.id != element.id){
              if (String(violation4).match(/^[0-9]+$/)) {
                if((!isNaN(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation4) 
                || String(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation4).match(/^[0-9]([a-z0-9]+)*$/)) 
                && element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation4 != '' ){
              
            //if((Number(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation) >= 0 && Number(violation) >= 0)) {
              errorMessageV.violation4 = "violation darf nicht gesetzt werden, da sie bereits in einem anderen Kreis gesetzt wurde.";
              delete element.businessObject.$attrs.violation4;
            //}
          }}
            if (String(violation4).match(/^[0-9]([a-z0-9]+)*$/) && !(String(violation4).match(/^[0-9]+$/))) {
             
              if((!isNaN(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation4) 
              || String(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation4).match(/^[0-9]([a-z0-9]+)*$/)) 
              && element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation4 != '' ){
              errorMessageV.violation4 = "violation darf nicht gesetzt werden, da sie bereits in einem anderen Kreis gesetzt wurde.";
              delete element.businessObject.$attrs.violation4;
            }
          }

          }
        }
      }
        return errorMessageV;
      }}
})),
group.entries.push(entryFactory.textField({
  id : 'prioritaet4',
  description : 'Priorität',
  label : 'Kamera-Priorität',
  modelProperty : 'prioritaet4',
  validate: function(element, values) {
    var prioritaet4 = values.prioritaet4;
    var errorMessageP = {};
    if(element.businessObject.$attrs.violation4 == undefined){
      errorMessageP.prioritaet4 = "Setze zuerst violation Attribut.";
      delete element.businessObject.$attrs.prioritaet4;
    }

    if (isNaN(prioritaet4)) {
      errorMessageP.prioritaet4 = "Priorität muss eine Nummmer sein.";
      delete element.businessObject.$attrs.prioritaet4;
    }

    if(element.businessObject.attachedToRef.$type == 'bpmn:SubProcess'&&
        element.businessObject.attachedToRef.suitable == 100){
        // Index vom aktuellen Element
        var find;

        var kind;
        var li;
        for(var k = 0; k < element.parent.children.length-1; k++){
          for(var l = 0; l < element.parent.children[k].attachers.length; l++){
            for(var m = 0; m < element.parent.children[k].attachers[l].host.attachers.length; m++){
            if(element.parent.children[k].attachers[l].host.attachers[m].id == element.id){
                kind = k;
                li = l;
                find = m;
            }
            }
          }

        }

        
        var onlyChild = false;
        if(element.parent.children.length-1 == 1){
               onlyChild = true;
        }
        

        if(prioritaet4 < 0){
          errorMessageP.prioritaet4 = "Priorität darf nicht kleiner 0 sein.";
          delete element.businessObject.$attrs.prioritaet4;
        }

        if(!onlyChild){ 
          for(var i = 0; i<element.parent.children[kind].attachers[li].host.attachers.length; i++){
            // gibt violation vom anderen Kreis aus
            if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.id != element.id){
            if((element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.prioritaet4 >= 0 && prioritaet4 >= 0)) {
              errorMessageP.prioritaet4 = "Priorität darf nicht gesetzt werden, da sie bereits in einem anderen Kreis gesetzt wurde.";
              delete element.businessObject.$attrs.prioritaet4;
            }
          }
        }
      }
        return errorMessageP;
      }}
})),
group.entries.push({
  html: '<img src="download.png" width="35">',
  id : 'icon5'
}),
group.entries.push(entryFactory.textField({
  id : 'violation5',
  description : 'Wenn Situation verletzt wird, springe zu Scope ID.',
  label : 'Update-Violation',
  modelProperty : 'violation5',
  validate: function(element, values) {
    var violation5 = values.violation5;
    var errorMessageV = {};
    if(element.businessObject.attachedToRef.$type == 'bpmn:SubProcess'&&
     element.businessObject.attachedToRef.suitable == 100){

    // Typ
    //console.log(element.businessObject.attachedToRef.$type);
    // über alle durch bis children = attachers
    // Index vom aktuellen Element
    var find;

    var kind;
    var li;
    // woran es drangeklebt ist
    // element.parent.children[0].attachers[0].host
    //console.log(element.parent.children[0]);
    //console.log(element.id);
    for(var k = 0; k < element.parent.children.length-1; k++){
      for(var l = 0; l < element.parent.children[k].attachers.length; l++){
        for(var m = 0; m < element.parent.children[k].attachers[l].host.attachers.length; m++){
        if(element.parent.children[k].attachers[l].host.attachers[m].id == element.id){
            kind = k;
            li = l;
            find = m;
        }
        }
      }

    }

    //console.log(element.parent.children[0].attachers[0].host.id);
    //console.log(element.parent.children.length);
    //for(var i = 0; i<element.parent.children.length-1; i++){
      //if(element.parent.children[0].attachers[0].host.attachers[i].id == element.id){
        //  find = i;
      //}
   // }

    //console.log("find"+find);
    //console.log(element.parent.children[0].attachers[0].host.attachers[i].violation);
    
    var onlyChild = false;
    //console.log("length"+ element.parent.children.length);
    if(element.parent.children.length-1 == 1){
           onlyChild = true;
           //console.log(onlyChild);
    }
    console.log(values);
    
    
    //console.log(element.parent.children);
    if (isNaN(violation5) && !String(violation5).match(/^[0-9]([a-z0-9]+)*$/)) {
      errorMessageV.violation5 = "Nicht valide Eingabe, da violation mit Zahl beginnen muss.";
      delete element.businessObject.$attrs.violation5; 
    }

    if(violation5 < 0){
      errorMessageV.violation5 = "violation darf nicht kleiner 0 sein.";
      delete element.businessObject.$attrs.violation5; 
    }

    if(!onlyChild){ 
      for(var i = 0; i<element.parent.children[kind].attachers[li].host.attachers.length; i++){
        // gibt violation vom anderen Kreis aus
        if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.id != element.id){
          if (String(violation5).match(/^[0-9]+$/)) {
            if((!isNaN(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation5) || String(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation5).match(/^[0-9]([a-z0-9]+)*$/)) && element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation5 != '' ){
          
        //if((Number(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation) >= 0 && Number(violation) >= 0)) {
          errorMessageV.violation5 = "violation darf nicht gesetzt werden, da sie bereits in einem anderen Kreis gesetzt wurde.";
          delete element.businessObject.$attrs.violation5; 
          //delete element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation;
        //}
      }}
        if (String(violation5).match(/^[0-9]([a-z0-9]+)*$/) && !(String(violation5).match(/^[0-9]+$/))) {
         
          if((!isNaN(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation5) 
          || String(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation5).match(/^[0-9]([a-z0-9]+)*$/)) 
          && element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation5 != '' ){
          errorMessageV.violation5 = "violation darf nicht gesetzt werden, da sie bereits in einem anderen Kreis gesetzt wurde.";
          delete element.businessObject.$attrs.violation5; 
          //delete element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation;
          
        }
      }

      }
    }
  }
    return errorMessageV;
  }
}})),
group.entries.push(entryFactory.textField({
  id : 'prioritaet5',
  description : 'Priorität',
  label : 'Akku-Priorität',
  modelProperty : 'prioritaet5',
  validate: function(element, values) {
    var prioritaet5 = values.prioritaet5;
    var errorMessageP = {};
    if(element.businessObject.$attrs.violation5 == undefined){
      errorMessageP.prioritaet5 = "Setze zuerst violation Attribut.";
      delete element.businessObject.$attrs.prioritaet5;
    }

    if (isNaN(prioritaet5)) {
      errorMessageP.prioritaet5 = "Priorität muss eine Nummmer sein.";
      delete element.businessObject.$attrs.prioritaet5;
    }

    if(element.businessObject.attachedToRef.$type == 'bpmn:SubProcess'&&
       element.businessObject.attachedToRef.suitable == 100){
       // Index vom aktuellen Element
        var find;

        var kind;
        var li;
        for(var k = 0; k < element.parent.children.length-1; k++){
          for(var l = 0; l < element.parent.children[k].attachers.length; l++){
            for(var m = 0; m < element.parent.children[k].attachers[l].host.attachers.length; m++){
              if(element.parent.children[k].attachers[l].host.attachers[m].id == element.id){
                kind = k;
                li = l;
                find = m;
              }
            }
           }
        }

    var onlyChild = false;
    if(element.parent.children.length-1 == 1){
           onlyChild = true;
    }

    if(prioritaet5 < 0){
      errorMessageP.prioritaet5 = "Priorität darf nicht kleiner 0 sein.";
      delete element.businessObject.$attrs.prioritaet5;
    }

    if(!onlyChild){ 
      for(var i = 0; i < element.parent.children[kind].attachers[li].host.attachers.length; i++){
        // gibt prioritaet vom anderen Kreis aus
        if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.id != element.id){
          if((element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.prioritaet5 >= 0 && prioritaet5 >= 0)) {
            errorMessageP.prioritaet5 = "Priorität darf nicht gesetzt werden, da sie bereits in einem anderen Kreis gesetzt wurde.";
            delete element.businessObject.$attrs.prioritaet5;
          }
        }
      }
    }
    return errorMessageP;
  }}
}))
  //addEntry(group, document.getElementById('situations').value);
} 
}

// TODO aendern von label description via Textfeld
// vielleicht anderer Ansatz probieren mit Number nach Start? 
function addEntry(group, j){
  for(var i = 0; i < j; i++){
  group.entries.push(entryFactory.textField({
    id : "violationN" + i.toString(),
    description : 'Wenn Situation verletzt wird, springe zu Scope ID.',
    label : 'Violation von neuen Situation '+ i,
    modelProperty : "violationN" + i.toString(),
    // todo
    validate: function(element, values) {
      var violationN = values.violationN0;
      var errorMessageV = {};
      if (isNaN(violationN)) {
         errorMessageV.violationN0 = "Please enter a valid priority (number)";
      }
      return errorMessageV;
    }
  })),
  group.entries.push(entryFactory.textField({
    id : 'prioritaetN' + i,
    description : 'Priorität',
    label : 'Priorität von neuen Situationen' + i,
    modelProperty : 'prioritaetN' + i,
    // todo
    validate: function(element, values) {
      var prioritaet = values.prioritaet;
      var errorMessageP = {};
      if (isNaN(prioritaet)) {
         errorMessageP.prioritaet = "Please enter a valid priority (number)";
      }
      return errorMessageP;
  }
  }))
}
 
}