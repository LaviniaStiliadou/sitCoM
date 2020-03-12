import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';
import connectM from 'diagram-js/lib/features/connect/Connect';
import {
  isAny,
  is
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
import canConnect from 'diagram-js/lib/features/connect/Connect';

export default function(group, element) {
  
  //displays the participant id in the situation tab
  
  if(isAny(element, ['bpmn:SubProcess']) && element.businessObject.suitable == 100){
	  group.entries.push(entryFactory.textField({
      id : 'participant',
      description : 'Participant id, which should contain a scope with the same prefix.',
      label : 'Participant id',
      modelProperty : 'participant',
      validate: function(element, values) {
         
        var participant = values.participant;
        var errorMessageP = {};
        if(element.parent.parent.type == 'bpmn:Participant' && participant !=undefined){
          var find = false;
          // entspricht der Participant Id, indem ich mich gerade befinde.
          var participantid = element.parent.parent.id;
          for(var i = 0; i< element.parent.parent.parent.children.length; i++){
             if(element.parent.parent.parent.children[i].id == participant  && element.parent.parent.parent.children[i].id  != participantid){
               find = true;
             }
          }
          if(!find){
            errorMessageP.participant = "There is no participant with this id or the id corresponds to the current participant . ";
            delete element.businessObject.$attrs.participant; 
          }
        }
        
       
        if ((!String(participant).match(/^Participant_[0-9]([a-z0-9]+)*$/)) && participant !=undefined) {
          errorMessageP.participant = "Not valid input, because the participant id should start with the prefix Participant_. Example Participant_1rj1vs7";
          delete element.businessObject.$attrs.participant; 
        }
            
            return errorMessageP;
          }
    }))
  }
          
  //display checkbox to activate compensation
  //todo: validate erzeugt copmensationsymbol
  if(isAny(element, ['bpmn:SubProcess']) && element.businessObject.suitable == 100){  
	  group.entries.push(entryFactory.textField({
      id : 'prioritaet',
      description : 'priority of the current scope',
      label : 'Scope-Priority',
      modelProperty : 'prioritaet',
      validate: function(element, values) {
        var prioritaet = values.prioritaet;
        var errorMessageP = {};

        if (isNaN(prioritaet)) {
          errorMessageP.prioritaet = "Priority must be a number.";
          delete element.businessObject.$attrs.prioritaet;
        }
		
        var onlyChild = false;
        if(element.parent.children.length == 1){
             onlyChild = true;
        }

        if(prioritaet < 0){
          errorMessageP.prioritaet = "Priority must not be less than 0.";
          delete element.businessObject.$attrs.prioritaet;
        }
        //console.log(element);

        if(!onlyChild){ 
    
          for(var i = 0; i < element.parent.children.length; i++){
            if(element != element.parent.children[i] && element.parent.children[i].type == 'bpmn:SubProcess' 
            && element.parent.children[i].businessObject.suitable == 100){
              var findOtherRed, findRed;
              var findOtherGreen, findGreen;
              var findOtherYellow, findYellow;
              for(var j = 0; j < element.attachers.length; j++){
                if(element.attachers[j].businessObject.suitable ==25){
                  findRed = j;
                }
                
                if(element.attachers[j].businessObject.suitable ==50){
                  findYellow = j;
                }
                
                if(element.attachers[j].businessObject.suitable ==100){
                  findGreen = j;
                }
              
              }
              for(var j = 0; j < element.parent.children[i].attachers.length; j++){
                  if(element.parent.children[i].attachers[j].businessObject.suitable ==25){
                    findOtherRed = j;
                  }
                  if(element.parent.children[i].attachers[j].businessObject.suitable ==50){
                    findOtherYellow = j;
                  }
                  if(element.parent.children[i].attachers[j].businessObject.suitable ==100){
                    findOtherGreen = j;
                  }
                
                }
                if(!isNaN(findGreen) && !isNaN(findOtherGreen)){ 
                  //console.log(element.attachers[findGreen].businessObject.$attrs.violation);
                  var greenSame = false;
                  if((element.attachers[findGreen].businessObject.$attrs.violation ==
                     element.parent.children[i].attachers[findOtherGreen].businessObject.$attrs.violation)&&
                     (element.attachers[findGreen].businessObject.$attrs.violation1 ==
                      element.parent.children[i].attachers[findOtherGreen].businessObject.$attrs.violation1)&&
                      (element.attachers[findGreen].businessObject.$attrs.violation2 ==
                        element.parent.children[i].attachers[findOtherGreen].businessObject.$attrs.violation2)&&
                        (element.attachers[findGreen].businessObject.$attrs.violation3 ==
                          element.parent.children[i].attachers[findOtherGreen].businessObject.$attrs.violation3)&&
                          (element.attachers[findGreen].businessObject.$attrs.violation4 ==
                            element.parent.children[i].attachers[findOtherGreen].businessObject.$attrs.violation4)&&
                            (element.attachers[findGreen].businessObject.$attrs.violation5 ==
                              element.parent.children[i].attachers[findOtherGreen].businessObject.$attrs.violation5)){
                                greenSame = true;
                                
                              }
                            } 
                  if(!isNaN(findRed) && !isNaN(findOtherRed)) {
                    var redSame = false;
                  if (element.attachers[findRed].businessObject.$attrs.violation ==
                    element.parent.children[i].attachers[findOtherRed].businessObject.$attrs.violation &&
                    (element.attachers[findRed].businessObject.$attrs.violation1 ==
                     element.parent.children[i].attachers[findOtherRed].businessObject.$attrs.violation1)&&
                     (element.attachers[findRed].businessObject.$attrs.violation2 ==
                       element.parent.children[i].attachers[findOtherRed].businessObject.$attrs.violation2)&&
                       (element.attachers[findRed].businessObject.$attrs.violation3 ==
                         element.parent.children[i].attachers[findOtherRed].businessObject.$attrs.violation3)&&
                         (element.attachers[findRed].businessObject.$attrs.violation4 ==
                           element.parent.children[i].attachers[findOtherRed].businessObject.$attrs.violation4)&&
                           (element.attachers[findRed].businessObject.$attrs.violation5 ==
                             element.parent.children[i].attachers[findOtherRed].businessObject.$attrs.violation5)) {
                                 redSame = true;
                             }
                            }
                    if(!isNaN(findYellow) && !isNaN(findOtherYellow) ){     
                      var yellowSame = false;
                    if(element.attachers[findYellow].businessObject.$attrs.violation ==
                        element.parent.children[i].attachers[findOtherYellow].businessObject.$attrs.violation&&
                          (element.attachers[findYellow].businessObject.$attrs.violation1 ==
                               element.parent.children[i].attachers[findOtherYellow].businessObject.$attrs.violation1)&&
                               (element.attachers[findYellow].businessObject.$attrs.violation2 ==
                                 element.parent.children[i].attachers[findOtherYellow].businessObject.$attrs.violation2)&&
                                 (element.attachers[findYellow].businessObject.$attrs.violation3 ==
                                   element.parent.children[i].attachers[findOtherYellow].businessObject.$attrs.violation3)&&
                                   (element.attachers[findYellow].businessObject.$attrs.violation4 ==
                                     element.parent.children[i].attachers[findOtherYellow].businessObject.$attrs.violation4)&&
                                     (element.attachers[findYellow].businessObject.$attrs.violation5 ==
                                       element.parent.children[i].attachers[findOtherYellow].businessObject.$attrs.violation5)){   
                                    yellowSame = true;      
                    }
                  }
                  if(yellowSame && redSame && greenSame){
                  errorMessageP.prioritaet = "The scopes " + element.id + " and " + element.parent.children[i].id + " are the same."
                  }
                  if(((redSame && greenSame) || (redSame && yellowSame) || (yellowSame && greenSame))&& element.attachers.length == 2 && element.parent.children[i].attachers.length == 2){
                    errorMessageP.prioritaet = "The scopes " + element.id + " and " + element.parent.children[i].id + " are the same."
                  }
                
                  if(greenSame && element.attachers.length == 1 && element.parent.children[i].attachers.length == 1){
                    errorMessageP.prioritaet = "The scopes " + element.id + " and " + element.parent.children[i].id + " are the same."
                  }
                  if(yellowSame && element.attachers.length == 1 && element.parent.children[i].attachers.length == 1){
                    errorMessageP.prioritaet = "The scopes " + element.id + " and " + element.parent.children[i].id + " are the same."
                  }
                  if(redSame && element.attachers.length == 1 && element.parent.children[i].attachers.length == 1){
                    errorMessageP.prioritaet = "The scopes " + element.id + " and " + element.parent.children[i].id + " are the same."
                  }

                  
                 // console.log(element.parent.children[i].attachers[j]);

                  //console.log(element.attachers[j]);
                //if(element.attachers[j].businessObject.suitable == 25 && element.parent.children[i].attachers[j].businessObject.suitable == 25){
                   //console.log("h");  
                //}
              }
              if((element.businessObject.$attrs.prioritaet == element.parent.children[i].businessObject.$attrs.prioritaet) 
              && (!isNaN(prioritaet)) && (element != element.parent.children[i])){
					      errorMessageP.prioritaet = "Priority may not be set, because it has already been set in another scope.";
                delete element.businessObject.$attrs.prioritaet;
                              }
			}
          }
        
		
          return errorMessageP;
	  }
  })),
	  
	  group.entries.push(entryFactory.checkbox({
      id : 'compensationCheckbox',
      description : 'If you select the checkbox, compensation is permitted in this scope.',
      label : 'Compensation',
      modelProperty : 'compensationCheckbox'
	  }))
  }

  
  if(isAny(element, ['bpmn:BoundaryEvent']) && element.businessObject.suitable ==50){
	  group.entries.push(entryFactory.checkbox({
      id : 'akkuCheckbox',
      description : 'If you select the checkbox, you cannot put any violation in the other circles.',
      label : 'Battery',
      modelProperty : 'akkuCheckbox',
      validate: function(element, values) {
        var violation = values.akkuCheckbox;
        //console.log(violation);
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
        for(var k = 0; k < element.parent.children.length; k++){
          if(element.parent.children[k].attachers !=null || element.parent.children[k].attachers !=undefined ){
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
        }

        var onlyChild = false;
        //console.log("length"+ element.parent.children.length);
        if(element.parent.children.length-1 == 1){
               onlyChild = true;
               //console.log(onlyChild);
        }
        //console.log(values);
        
        
        //console.log(element.parent.children);
        if (!violation) {
          delete element.businessObject.$attrs.akkuCheckbox; 
        }

        
        if(!onlyChild){ 
          for(var i = 0; i<element.parent.children[kind].attachers[li].host.attachers.length; i++){
            // gibt violation vom anderen Kreis aus
            if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.id != element.id){
              if(violation){
                if((!isNaN(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation) 
                || element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.akkuCheckbox 
                || String(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation).match(/^InnerScope_[0-9]([a-z0-9]+)*$/))){
             
            //if((Number(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation) >= 0 && Number(violation) >= 0)) {
              errorMessageV.akkuCheckbox = "Violation must not be set, because it has already been set in another circle. ";
              delete element.businessObject.$attrs.akkuCheckbox; 
              //delete element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation;
            //}
          }}
            

          }
        }
      }
        return errorMessageV;
      }
      
    }
    })), 
    group.entries.push(entryFactory.checkbox({
      id : 'spinneCheckbox',
      description : 'If you select the checkbox, you cannot put any violation in the other circles.',
      label : 'Spider',
      modelProperty : 'spinneCheckbox',
      validate: function(element, values) {
        var violation = values.spinneCheckbox;
        //console.log(violation);
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
        for(var k = 0; k < element.parent.children.length; k++){
          if(element.parent.children[k].attachers !=null || element.parent.children[k].attachers !=undefined ){
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
        }

        var onlyChild = false;
        //console.log("length"+ element.parent.children.length);
        if(element.parent.children.length-1 == 1){
               onlyChild = true;
               //console.log(onlyChild);
        }
        //console.log(values);
        
        
        //console.log(element.parent.children);
        if (!violation) {
          delete element.businessObject.$attrs.spinneCheckbox; 
        }


        if(!onlyChild){ 
          for(var i = 0; i<element.parent.children[kind].attachers[li].host.attachers.length; i++){
            // gibt violation vom anderen Kreis aus
            if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.id != element.id){
              if (violation) {
                if((!isNaN(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation2) 
                || element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.spinneCheckbox )
                || String(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation2).match(/^InnerScope_[0-9]([a-z0-9]+)*$/)){
              
            //if((Number(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation) >= 0 && Number(violation) >= 0)) {
              errorMessageV.spinneCheckbox = "Violation must not be set, because it has already been set in another circle. ";
              delete element.businessObject.$attrs.spinneCheckbox; 
              //delete element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation;
            //}
          }}
            

          }
        }
      }
        return errorMessageV;
      }
      
    }
    })), 
    group.entries.push(entryFactory.checkbox({
      id : 'menschCheckbox',
      description : 'If you select the checkbox, you cannot put any violation in the other circles.',
      label : 'Human',
      modelProperty : 'menschCheckbox',
      validate: function(element, values) {
        var violation = values.menschCheckbox;
        //console.log(violation);
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
        for(var k = 0; k < element.parent.children.length; k++){
          if(element.parent.children[k].attachers !=null || element.parent.children[k].attachers !=undefined ){
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
        }

        var onlyChild = false;
        //console.log("length"+ element.parent.children.length);
        if(element.parent.children.length-1 == 1){
               onlyChild = true;
               //console.log(onlyChild);
        }
        //console.log(values);
        
        
        //console.log(element.parent.children);
        if (!violation) {
          delete element.businessObject.$attrs.menschCheckbox; 
        }


        if(!onlyChild){ 
          for(var i = 0; i<element.parent.children[kind].attachers[li].host.attachers.length; i++){
            // gibt violation vom anderen Kreis aus
            if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.id != element.id){
              if (violation) {
                if((!isNaN(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation3) 
                || element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.menschCheckbox )
                || String(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation3).match(/^InnerScope_[0-9]([a-z0-9]+)*$/)){
              
            //if((Number(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation) >= 0 && Number(violation) >= 0)) {
              errorMessageV.menschCheckbox = "Violation must not be set, because it has already been set in another circle. ";
              delete element.businessObject.$attrs.menschCheckbox; 
              //delete element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation;
            //}
          }}
            

          }
        }
      }
        return errorMessageV;
      }
      
    }
    })), 
    group.entries.push(entryFactory.checkbox({
      id : 'kameraCheckbox',
      description : 'If you select the checkbox, you cannot put any violation in the other circles.',
      label : 'Camera',
      modelProperty : 'kameraCheckbox',
      validate: function(element, values) {
        var violation = values.kameraCheckbox;
        //console.log(violation);
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
        for(var k = 0; k < element.parent.children.length; k++){
          if(element.parent.children[k].attachers !=null || element.parent.children[k].attachers !=undefined ){
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
        }

        var onlyChild = false;
        //console.log("length"+ element.parent.children.length);
        if(element.parent.children.length-1 == 1){
               onlyChild = true;
               //console.log(onlyChild);
        }
        //console.log(values);
        
        
        //console.log(element.parent.children);
        if (!violation) {
          delete element.businessObject.$attrs.kameraCheckbox; 
        }


        if(!onlyChild){ 
          for(var i = 0; i<element.parent.children[kind].attachers[li].host.attachers.length; i++){
            // gibt violation vom anderen Kreis aus
            if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.id != element.id){
              if (violation) {
                if((!isNaN(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation4) 
                || element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.kameraCheckbox )
                || String(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation4).match(/^InnerScope_[0-9]([a-z0-9]+)*$/)){
              
            //if((Number(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation) >= 0 && Number(violation) >= 0)) {
              errorMessageV.kameraCheckbox = "Violation must not be set, because it has already been set in another circle. ";
              delete element.businessObject.$attrs.kameraCheckbox; 
              //delete element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation;
            //}
          }}
            

          }
        }
      }
        return errorMessageV;
      }
      
    }
    })), 
    group.entries.push(entryFactory.checkbox({
      id : 'updateCheckbox',
      description : 'If you select the checkbox, you cannot put any violation in the other circles.',
      label : 'Update',
      modelProperty : 'updateCheckbox',
      validate: function(element, values) {
        var violation = values.updateCheckbox;
        //console.log(violation);
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
        for(var k = 0; k < element.parent.children.length; k++){
          if(element.parent.children[k].attachers !=null || element.parent.children[k].attachers !=undefined ){
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
        }

        var onlyChild = false;
        //console.log("length"+ element.parent.children.length);
        if(element.parent.children.length-1 == 1){
               onlyChild = true;
               //console.log(onlyChild);
        }
        //console.log(values);
        
        
        //console.log(element.parent.children);
        if (!violation) {
          delete element.businessObject.$attrs.updateCheckbox; 
        }


        if(!onlyChild){ 
          for(var i = 0; i<element.parent.children[kind].attachers[li].host.attachers.length; i++){
            // gibt violation vom anderen Kreis aus
            if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.id != element.id){
              if (violation) {
                if((!isNaN(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation5) 
                || element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.updateCheckbox )
                || String(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation5).match(/^InnerScope_[0-9]([a-z0-9]+)*$/)){
              
            //if((Number(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation) >= 0 && Number(violation) >= 0)) {
              errorMessageV.updateCheckbox = "Violation must not be set, because it has already been set in another circle. ";
              delete element.businessObject.$attrs.updateCheckbox; 
              //delete element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation;
            //}
          }}
            

          }
        }
      }
        return errorMessageV;
      }
      
    }
	  }))
  }

  // Only return an entry, if the currently selected
  // element is one of these types.
  if (isAny(element, [
      'bpmn:IntermediateThrowEvent',
      'bpmn:IntermediateCatchEvent', 'bpmn:BoundaryEvent' ])&& (element.businessObject.suitable ==100 || element.businessObject.suitable ==25) ) {
    
    group.entries.push({
      html: '<img src="Batterie.jpg" width="25">',
      id : 'icon'
    }),
    group.entries.push(entryFactory.textField({
      id : 'violation',
      description : 'If situation is violated, jump to scope id. ',
      label : 'Battery-Violation',
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
        for(var k = 0; k < element.parent.children.length; k++){
          if(element.parent.children[k].attachers !=null || element.parent.children[k].attachers !=undefined ){
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
        //console.log(values);
        
        
        //console.log(element.parent.children);
        if (!String(violation).match(/^InnerScope_[0-9]([a-z0-9]+)*$/)) {
          errorMessageV.violation = "Not valid input, because the violation attribute should start with the prefix Innerscope_. Example InnerScope_1rj1vs7.";
          delete element.businessObject.$attrs.violation; 
        }
        
  
        if(String(violation).match(/^InnerScope_[0-9]([a-z0-9]+)*$/)){

          var matchFoundR = false, matchCircleR = false, matchCircleYR = false;
          var matchFoundG = false, matchCircleG = false, matchCircleYG = false;
          var scope;
          for(var i=0; i<element.parent.children.length; i++){
           // console.log(element.parent.children[kind].attachers[li].host);
            if(element.parent.children[i].id == violation &&
              element.parent.children[kind].attachers[li].host.id != violation){
              scope = i;
              if(element.businessObject.suitable == 25){
             //   console.log("gg");
                for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
                  var rot = false;
                  if(element.parent.children[scope].attachers[j].businessObject.suitable == 25){
                  if((element.parent.children[scope].attachers[j].businessObject.$attrs.violation == undefined)){
               //     console.log("vi");
                    
                   matchCircleR = true;
                 //  console.log(matchCircleR);
                }
                
                }
                //console.log("va");
                //console.log(matchCircleR);
                }
                for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
                  var rot = false;
                  if(element.parent.children[scope].attachers[j].businessObject.suitable == 50){
                  if(!(element.parent.children[scope].attachers[j].businessObject.$attrs.akkuCheckbox)){
               //     console.log("vi");
                    
                   matchCircleYR = true;
                 //  console.log(matchCircleR);
                }
                
                }
                //console.log("va");
                //console.log(matchCircleR);
                }
                for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
                  //console.log(scope);
                  //console.log()
                  //console.log(element.parent.children[scope].attachers[j].businessObject.suitable);
                  if(element.parent.children[scope].attachers[j].businessObject.suitable == 100){
                     matchFoundR = true;
                    // console.log(100);
                  }
                }  
                
              }
              if(element.businessObject.suitable == 100){
                //console.log(25);
                for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
                  
                  if(element.parent.children[scope].attachers[j].businessObject.suitable == 100){
                    if((element.parent.children[scope].attachers[j].businessObject.$attrs.violation == undefined)){
                  //    console.log(element.parent.children[scope].attachers[j].businessObject.$attrs.violation);
                     matchCircleG = true;
                    // console.log(100);
                  }
                }
                }
                for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
                  var rot = false;
                  if(element.parent.children[scope].attachers[j].businessObject.suitable == 50){
                  if(!(element.parent.children[scope].attachers[j].businessObject.$attrs.akkuCheckbox)){
               //     console.log("vi");
                    
                   matchCircleYG = true;
                 //  console.log(matchCircleR);
                }
                
                }
                //console.log("va");
                //console.log(matchCircleR);
                }
                for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
                 // console.log(scope);
                  if(element.parent.children[scope].attachers[j].businessObject.suitable == 25){
                     matchFoundG = true;
                    // console.log(100);
                  }
                } 
                
              }
        
        }
      }
      //console.log(!matchCircleR);
      //console.log(!matchFoundR);
      if(element.businessObject.suitable == 25){
          if((!matchCircleR || !matchFoundR) || !matchCircleYR){
            
        errorMessageV.violation = "Not valid input, because either the complementary circle is missing or an input in the circle of the same color has been made. ";
        delete element.businessObject.$attrs.violation; 
      }
    }
    if(element.businessObject.suitable == 100){
    if((!matchCircleG || !matchFoundG || !matchCircleYG)) {
          
      errorMessageV.violation = "Not valid input, because either the complementary circle is missing or an input in the circle of the same color has been made. ";
      delete element.businessObject.$attrs.violation; 
    } 
  }
    
        
    }
        if(!onlyChild){ 
          for(var i = 0; i<element.parent.children[kind].attachers[li].host.attachers.length; i++){
            // gibt violation vom anderen Kreis aus
            if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.id != element.id){
              if (String(violation).match(/^InnerScope_[0-9]+$/)) {
                if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.akkuCheckbox 
                  ||(!isNaN(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation)
                   || String(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation).match(/^InnerScope_[0-9]([a-z0-9]+)*$/)) 
                   && element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation != '' ){
              
            //if((Number(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation) >= 0 && Number(violation) >= 0)) {
              errorMessageV.violation = "Violation must not be set, because it has already been set in another circle. ";
              delete element.businessObject.$attrs.violation; 
              //delete element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation;
            //}
          }}
            if (String(violation).match(/^InnerScope_[0-9]([a-z0-9]+)*$/) && !(String(violation).match(/^InnerScope_[0-9]+$/))) {
             
              if((element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.akkuCheckbox 
                ||!isNaN(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation) 
              || String(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation).match(/^InnerScope_[0-9]([a-z0-9]+)*$/)) 
              && element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation != '' ){
              errorMessageV.violation = "Violation must not be set, because it has already been set in another circle.";
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
      description : 'Priority',
      label : 'Battery-Priority',
      modelProperty : 'prioritaet',
      validate: function(element, values) {
        var prioritaet = values.prioritaet;
        var errorMessageP = {};
        if(element.businessObject.$attrs.violation == undefined){
          errorMessageP.prioritaet = "Set violation attribute first.";
          delete element.businessObject.$attrs.prioritaet;
        }

        if (isNaN(prioritaet)) {
          errorMessageP.prioritaet = "Priority must be a number.";
          delete element.businessObject.$attrs.prioritaet;
        }

        if(element.businessObject.attachedToRef.$type == 'bpmn:SubProcess'&&
           element.businessObject.attachedToRef.suitable == 100){
           // Index vom aktuellen Element
            var find;

            var kind;
            var li;
            for(var k = 0; k < element.parent.children.length; k++){
              if(element.parent.children[k].attachers !=null || element.parent.children[k].attachers !=undefined ){
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
            }

        var onlyChild = false;
        if(element.parent.children.length-1 == 1){
               onlyChild = true;
        }

        if(prioritaet < 0){
          errorMessageP.prioritaet = "Priority may not be less than 0.";
          delete element.businessObject.$attrs.prioritaet;
        }

        if(!isNaN(element.businessObject.$attrs.prioritaet) && (
          (element.businessObject.$attrs.prioritaet == element.businessObject.$attrs.prioritaet5)||
          (element.businessObject.$attrs.prioritaet == element.businessObject.$attrs.prioritaet4)||
          (element.businessObject.$attrs.prioritaet == element.businessObject.$attrs.prioritaet3) ||
          (element.businessObject.$attrs.prioritaet == element.businessObject.$attrs.prioritaet2))){
            errorMessageP.prioritaet = "Priority must be an unique number.";
            delete element.businessObject.$attrs.prioritaet;
          }

        if(!onlyChild){ 
          for(var i = 0; i < element.parent.children[kind].attachers[li].host.attachers.length; i++){
            // gibt prioritaet vom anderen Kreis aus
            if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.id != element.id){
              if((element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.prioritaet >= 0 && prioritaet >= 0)) {
                errorMessageP.prioritaet = "Priority must not be set because it has already been set in another circle. ";
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
    description : 'If situation is violated, jump to scope id.',
    label : 'Spider-Violation',
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
      for(var k = 0; k < element.parent.children.length; k++){
        if(element.parent.children[k].attachers !=null || element.parent.children[k].attachers !=undefined ){
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
      //console.log(values);
      
      
      //console.log(element.parent.children);
      if (!String(violation2).match(/^InnerScope_[0-9]([a-z0-9]+)*$/)) {
        errorMessageV.violation2 = "Not valid input, because the violation attribute should start with the prefix Innerscope_. Example InnerScope_1rj1vs7.";
        delete element.businessObject.$attrs.violation2; 
      }
      

      if(String(violation2).match(/^InnerScope_[0-9]([a-z0-9]+)*$/)){

        var matchFoundR = false, matchCircleR = false, matchCircleYR = false;
        var matchFoundG = false, matchCircleG = false, matchCircleYG = false;
        var scope;
        for(var i=0; i<element.parent.children.length; i++){
         // console.log(element.parent.children[kind].attachers[li].host);
          if(element.parent.children[i].id == violation2 &&
            element.parent.children[kind].attachers[li].host.id != violation2){
            scope = i;
            if(element.businessObject.suitable == 25){
           //   console.log("gg");
              for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
                var rot = false;
                if(element.parent.children[scope].attachers[j].businessObject.suitable == 25){
                if((element.parent.children[scope].attachers[j].businessObject.$attrs.violation2 == undefined)){
             //     console.log("vi");
                  
                 matchCircleR = true;
               //  console.log(matchCircleR);
              }
              
              }
              //console.log("va");
              //console.log(matchCircleR);
              }
              for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
                var rot = false;
                if(element.parent.children[scope].attachers[j].businessObject.suitable == 50){
                if(!(element.parent.children[scope].attachers[j].businessObject.$attrs.spinneCheckbox)){
             //     console.log("vi");
                  
                 matchCircleYR = true;
               //  console.log(matchCircleR);
              }
              
              }
              //console.log("va");
              //console.log(matchCircleR);
              }
              for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
                //console.log(scope);
                //console.log()
                //console.log(element.parent.children[scope].attachers[j].businessObject.suitable);
                if(element.parent.children[scope].attachers[j].businessObject.suitable == 100){
                   matchFoundR = true;
                  // console.log(100);
                }
              }  
              
            }
            if(element.businessObject.suitable == 100){
              //console.log(25);
              for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
                
                if(element.parent.children[scope].attachers[j].businessObject.suitable == 100){
                  if((element.parent.children[scope].attachers[j].businessObject.$attrs.violation2 == undefined)){
                //    console.log(element.parent.children[scope].attachers[j].businessObject.$attrs.violation);
                   matchCircleG = true;
                  // console.log(100);
                }
              }
              }
              for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
                var rot = false;
                if(element.parent.children[scope].attachers[j].businessObject.suitable == 50){
                if(!(element.parent.children[scope].attachers[j].businessObject.$attrs.spinneCheckbox)){
             //     console.log("vi");
                  
                 matchCircleYG = true;
               //  console.log(matchCircleR);
              }
              
              }
              //console.log("va");
              //console.log(matchCircleR);
              }
              for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
               // console.log(scope);
                if(element.parent.children[scope].attachers[j].businessObject.suitable == 25){
                   matchFoundG = true;
                  // console.log(100);
                }
              } 
              
            }
      
      }
    }
    //console.log(!matchCircleR);
    //console.log(!matchFoundR);
    if(element.businessObject.suitable == 25){
        if((!matchCircleR || !matchFoundR) || !matchCircleYR){
          
      errorMessageV.violation2 = "Not valid input, because either the complementary circle is missing or an input in the circle of the same color has been made. ";
      delete element.businessObject.$attrs.violation2; 
    }
  }
  if(element.businessObject.suitable == 100){
  if((!matchCircleG || !matchFoundG || !matchCircleYG)) {
        
    errorMessageV.violation2 = "Not valid input, because either the complementary circle is missing or an input in the circle of the same color has been made. ";
    delete element.businessObject.$attrs.violation2; 
  } 
}
  
      
  }
      if(!onlyChild){ 
        for(var i = 0; i<element.parent.children[kind].attachers[li].host.attachers.length; i++){
          // gibt violation vom anderen Kreis aus
          if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.id != element.id){
            if (String(violation2).match(/^InnerScope_[0-9]+$/)) {
              if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.spinneCheckbox 
                ||(!isNaN(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation2)
                 || String(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation2).match(/^InnerScope_[0-9]([a-z0-9]+)*$/)) 
                 && element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation2 != '' ){
            
          //if((Number(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation) >= 0 && Number(violation) >= 0)) {
            errorMessageV.violation2 = "Violation must not be set because it has already been set in another circle. ";
            delete element.businessObject.$attrs.violation2; 
            //delete element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation;
          //}
        }}
          if (String(violation2).match(/^InnerScope_[0-9]([a-z0-9]+)*$/) && !(String(violation2).match(/^InnerScope_[0-9]+$/))) {
           
            if((element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.spinneCheckbox 
              ||!isNaN(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation2) 
            || String(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation2).match(/^InnerScope_[0-9]([a-z0-9]+)*$/)) 
            && element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation2 != '' ){
            errorMessageV.violation2 = "Violation must not be set because it has already been set in another circle. ";
            delete element.businessObject.$attrs.violation2; 
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
    id : 'prioritaet2',
    description : 'Priority',
    label : 'Spider-Priority',
    modelProperty : 'prioritaet2',
    validate: function(element, values) {
    var prioritaet2 = values.prioritaet2;
    var errorMessageP = {};
    if(element.businessObject.$attrs.violation2 == undefined){
      errorMessageP.prioritaet2 = "Set violation attribute first.";
      delete element.businessObject.$attrs.prioritaet2;
    }

    if (isNaN(prioritaet2)) {
      errorMessageP.prioritaet2 = "Priority must be a number.";
      delete element.businessObject.$attrs.prioritaet2;
    }

    if(element.businessObject.attachedToRef.$type == 'bpmn:SubProcess'&&
        element.businessObject.attachedToRef.suitable == 100){
        // Index vom aktuellen Element
        var find;

        var kind;
        var li;
        for(var k = 0; k < element.parent.children.length; k++){
          if(element.parent.children[k].attachers !=null || element.parent.children[k].attachers !=undefined ){
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
        }

        
        var onlyChild = false;
        if(element.parent.children.length-1 == 1){
               onlyChild = true;
        }

        if(prioritaet2 < 0){
          errorMessageP.prioritaet2 = "Priority may not be less than 0.";
          delete element.businessObject.$attrs.prioritaet2;
        }

        if(!isNaN(element.businessObject.$attrs.prioritaet2) && (
          (element.businessObject.$attrs.prioritaet2 == element.businessObject.$attrs.prioritaet5)||
          (element.businessObject.$attrs.prioritaet2 == element.businessObject.$attrs.prioritaet4)||
          (element.businessObject.$attrs.prioritaet2 == element.businessObject.$attrs.prioritaet3) ||
          (element.businessObject.$attrs.prioritaet2 == element.businessObject.$attrs.prioritaet))){
            errorMessageP.prioritaet2 = "Priority must be an unique number.";
            delete element.businessObject.$attrs.prioritaet2;
          }

        if(!onlyChild){ 
          for(var i = 0; i<element.parent.children[kind].attachers[li].host.attachers.length; i++){
            // gibt violation vom anderen Kreis aus
            if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.id != element.id){
            if((element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.prioritaet2 >= 0 && prioritaet2 >= 0)) {
              errorMessageP.prioritaet2 = "Priority must not be set because it has already been set in another circle.";
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
    description : 'If situation is violated, jump to scope id.',
    label : 'Human-Violation',
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
      for(var k = 0; k < element.parent.children.length; k++){
        if(element.parent.children[k].attachers !=null || element.parent.children[k].attachers !=undefined ){
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
      //console.log(values);
      
      
      //console.log(element.parent.children);
      if (!String(violation3).match(/^InnerScope_[0-9]([a-z0-9]+)*$/)) {
        errorMessageV.violation3 = "Not valid input, because the violation attribute should start with the prefix Innerscope_. Example InnerScope_1rj1vs7.";
        delete element.businessObject.$attrs.violation3; 
      }

      if(String(violation3).match(/^InnerScope_[0-9]([a-z0-9]+)*$/)){

        var matchFoundR = false, matchCircleR = false, matchCircleYR = false;
        var matchFoundG = false, matchCircleG = false, matchCircleYG = false;
        var scope;
        for(var i=0; i<element.parent.children.length; i++){
         // console.log(element.parent.children[kind].attachers[li].host);
          if(element.parent.children[i].id == violation3 &&
            element.parent.children[kind].attachers[li].host.id != violation3){
            scope = i;
            if(element.businessObject.suitable == 25){
           //   console.log("gg");
              for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
                var rot = false;
                if(element.parent.children[scope].attachers[j].businessObject.suitable == 25){
                if((element.parent.children[scope].attachers[j].businessObject.$attrs.violation3 == undefined)){
             //     console.log("vi");
                  
                 matchCircleR = true;
               //  console.log(matchCircleR);
              }
              
              }
              //console.log("va");
              //console.log(matchCircleR);
              }
              for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
                var rot = false;
                if(element.parent.children[scope].attachers[j].businessObject.suitable == 50){
                if(!(element.parent.children[scope].attachers[j].businessObject.$attrs.menschCheckbox)){
             //     console.log("vi");
                  
                 matchCircleYR = true;
               //  console.log(matchCircleR);
              }
              
              }
              //console.log("va");
              //console.log(matchCircleR);
              }
              for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
                //console.log(scope);
                //console.log()
                //console.log(element.parent.children[scope].attachers[j].businessObject.suitable);
                if(element.parent.children[scope].attachers[j].businessObject.suitable == 100){
                   matchFoundR = true;
                  // console.log(100);
                }
              }  
              
            }
            if(element.businessObject.suitable == 100){
              //console.log(25);
              for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
                
                if(element.parent.children[scope].attachers[j].businessObject.suitable == 100){
                  if((element.parent.children[scope].attachers[j].businessObject.$attrs.violation3 == undefined)){
                //    console.log(element.parent.children[scope].attachers[j].businessObject.$attrs.violation);
                   matchCircleG = true;
                  // console.log(100);
                }
              }
              }
              for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
                var rot = false;
                if(element.parent.children[scope].attachers[j].businessObject.suitable == 50){
                if(!(element.parent.children[scope].attachers[j].businessObject.$attrs.menschCheckbox)){
             //     console.log("vi");
                  
                 matchCircleYG = true;
               //  console.log(matchCircleR);
              }
              
              }
              //console.log("va");
              //console.log(matchCircleR);
              }
              for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
               // console.log(scope);
                if(element.parent.children[scope].attachers[j].businessObject.suitable == 25){
                   matchFoundG = true;
                  // console.log(100);
                }
              } 
              
            }
      
      }
    }
    //console.log(!matchCircleR);
    //console.log(!matchFoundR);
    if(element.businessObject.suitable == 25){
        if((!matchCircleR || !matchFoundR) || !matchCircleYR){
          
      errorMessageV.violation3 = "Not valid input, because either the complementary circle is missing or an input in the circle of the same color has been made. ";
      delete element.businessObject.$attrs.violation3; 
    }
  }
  if(element.businessObject.suitable == 100){
  if((!matchCircleG || !matchFoundG || !matchCircleYG)) {
        
    errorMessageV.violation3 = "Not valid input, because either the complementary circle is missing or an input in the circle of the same color has been made. ";
    delete element.businessObject.$attrs.violation3; 
  } 
}
      
  }
      if(!onlyChild){ 
        for(var i = 0; i<element.parent.children[kind].attachers[li].host.attachers.length; i++){
          // gibt violation vom anderen Kreis aus
          if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.id != element.id){
            if (String(violation3).match(/^InnerScope_[0-9]+$/)) {
              if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.menschCheckbox 
                ||(!isNaN(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation3)
                 || String(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation3).match(/^InnerScope_[0-9]([a-z0-9]+)*$/)) 
                 && element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation3 != '' ){
            
          //if((Number(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation) >= 0 && Number(violation) >= 0)) {
            errorMessageV.violation3 = "Violation must not be set, because it has already been set in another circle.";
            delete element.businessObject.$attrs.violation3; 
            //delete element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation;
          //}
        }}
          if (String(violation3).match(/^InnerScope_[0-9]([a-z0-9]+)*$/) && !(String(violation3).match(/^InnerScope_[0-9]+$/))) {
           
            if((element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.menschCheckbox 
              ||!isNaN(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation3) 
            || String(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation3).match(/^InnerScope_[0-9]([a-z0-9]+)*$/)) 
            && element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation3 != '' ){
            errorMessageV.violation3 = "Violation must not be set, because it has already been set in another circle.";
            delete element.businessObject.$attrs.violation3; 
            //delete element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation;
            
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
    description : 'Priority',
    label : 'Human-Priority',
    modelProperty : 'prioritaet3',
    validate: function(element, values) {
    var prioritaet3 = values.prioritaet3;
    var errorMessageP = {};
    if(element.businessObject.$attrs.violation3 == undefined){
      errorMessageP.prioritaet3 = "Set violation attribute first.";
      delete element.businessObject.$attrs.prioritaet3;
    }

    if (isNaN(prioritaet3)) {
      errorMessageP.prioritaet3 = "Priority must be a number.";
      delete element.businessObject.$attrs.prioritaet3;
    }

    if(element.businessObject.attachedToRef.$type == 'bpmn:SubProcess'&&
        element.businessObject.attachedToRef.suitable == 100){
        // Index vom aktuellen Element
        var find;

        var kind;
        var li;
        for(var k = 0; k < element.parent.children.length; k++){
          if(element.parent.children[k].attachers !=null || element.parent.children[k].attachers !=undefined ){
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
        }

        
        var onlyChild = false;
        if(element.parent.children.length-1 == 1){
               onlyChild = true;
        }
        //console.log(element.parent.children);
        if(prioritaet3 < 0){
          errorMessageP.prioritaet3 = "Priority may not be less than 0.";
          delete element.businessObject.$attrs.prioritaet3;
        }
        if(!isNaN(element.businessObject.$attrs.prioritaet3) && (
          (element.businessObject.$attrs.prioritaet3 == element.businessObject.$attrs.prioritaet5)||
          (element.businessObject.$attrs.prioritaet3 == element.businessObject.$attrs.prioritaet4)||
          (element.businessObject.$attrs.prioritaet3 == element.businessObject.$attrs.prioritaet2) ||
          (element.businessObject.$attrs.prioritaet3 == element.businessObject.$attrs.prioritaet))){
            errorMessageP.prioritaet3 = "Priority must not be set because it has already been set in another circle.";
            delete element.businessObject.$attrs.prioritaet3;
          }

        if(!onlyChild){ 
          for(var i = 0; i<element.parent.children[kind].attachers[li].host.attachers.length; i++){
            // gibt violation vom anderen Kreis aus
            if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.id != element.id){
            if((element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.prioritaet3 >= 0 && prioritaet3 >= 0)) {
              errorMessageP.prioritaet3 = "Priority must not be set because it has already been set in another circle.";
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
  description : 'If situation is violated, jump to scope id.',
  label : 'Camera-Violation',
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
    for(var k = 0; k < element.parent.children.length; k++){
      if(element.parent.children[k].attachers !=null || element.parent.children[k].attachers !=undefined ){
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
    //console.log(values);
    
    
    //console.log(element.parent.children);
    if (!String(violation4).match(/^InnerScope_[0-9]([a-z0-9]+)*$/)) {
      errorMessageV.violation4 = "Not valid input, because the violation attribute should start with the prefix Innerscope_. Example InnerScope_1rj1vs7.";
      delete element.businessObject.$attrs.violation4; 
    }
    

    if(String(violation4).match(/^InnerScope_[0-9]([a-z0-9]+)*$/)){

      var matchFoundR = false, matchCircleR = false, matchCircleYR = false;
      var matchFoundG = false, matchCircleG = false, matchCircleYG = false;
      var scope;
      for(var i=0; i<element.parent.children.length; i++){
       // console.log(element.parent.children[kind].attachers[li].host);
        if(element.parent.children[i].id == violation4 &&
          element.parent.children[kind].attachers[li].host.id != violation4){
          scope = i;
          if(element.businessObject.suitable == 25){
         //   console.log("gg");
            for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
              var rot = false;
              if(element.parent.children[scope].attachers[j].businessObject.suitable == 25){
              if((element.parent.children[scope].attachers[j].businessObject.$attrs.violation4 == undefined)){
           //     console.log("vi");
                
               matchCircleR = true;
             //  console.log(matchCircleR);
            }
            
            }
            //console.log("va");
            //console.log(matchCircleR);
            }
            for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
              var rot = false;
              if(element.parent.children[scope].attachers[j].businessObject.suitable == 50){
              if(!(element.parent.children[scope].attachers[j].businessObject.$attrs.kameraCheckbox)){
           //     console.log("vi");
                
               matchCircleYR = true;
             //  console.log(matchCircleR);
            }
            
            }
            //console.log("va");
            //console.log(matchCircleR);
            }
            for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
              //console.log(scope);
              //console.log()
              //console.log(element.parent.children[scope].attachers[j].businessObject.suitable);
              if(element.parent.children[scope].attachers[j].businessObject.suitable == 100){
                 matchFoundR = true;
                // console.log(100);
              }
            }  
            
          }
          if(element.businessObject.suitable == 100){
            //console.log(25);
            for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
              
              if(element.parent.children[scope].attachers[j].businessObject.suitable == 100){
                if((element.parent.children[scope].attachers[j].businessObject.$attrs.violation4 == undefined)){
              //    console.log(element.parent.children[scope].attachers[j].businessObject.$attrs.violation);
                 matchCircleG = true;
                // console.log(100);
              }
            }
            }
            for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
              var rot = false;
              if(element.parent.children[scope].attachers[j].businessObject.suitable == 50){
              if(!(element.parent.children[scope].attachers[j].businessObject.$attrs.kameraCheckbox)){
           //     console.log("vi");
                
               matchCircleYG = true;
             //  console.log(matchCircleR);
            }
            
            }
            //console.log("va");
            //console.log(matchCircleR);
            }
            for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
             // console.log(scope);
              if(element.parent.children[scope].attachers[j].businessObject.suitable == 25){
                 matchFoundG = true;
                // console.log(100);
              }
            } 
            
          }
    
    }
  }
  //console.log(!matchCircleR);
  //console.log(!matchFoundR);
  if(element.businessObject.suitable == 25){
      if((!matchCircleR || !matchFoundR) || !matchCircleYR){
        
    errorMessageV.violation4 = "Not valid input, because either the complementary circle is missing or an input in the circle of the same color has been made. ";
    delete element.businessObject.$attrs.violation4; 
  }
}
if(element.businessObject.suitable == 100){
if((!matchCircleG || !matchFoundG || !matchCircleYG)) {
      
  errorMessageV.violation4 = "Not valid input, because either the complementary circle is missing or an input in the circle of the same color has been made. ";
  delete element.businessObject.$attrs.violation4; 
} 
}

    
}
    if(!onlyChild){ 
      for(var i = 0; i<element.parent.children[kind].attachers[li].host.attachers.length; i++){
        // gibt violation vom anderen Kreis aus
        if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.id != element.id){
          if (String(violation4).match(/^InnerScope_[0-9]+$/)) {
            if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.kameraCheckbox 
              ||(!isNaN(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation4)
               || String(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation4).match(/^InnerScope_[0-9]([a-z0-9]+)*$/)) 
               && element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation4 != '' ){
          
        //if((Number(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation) >= 0 && Number(violation) >= 0)) {
          errorMessageV.violation4 = "Violation must not be set, because it has already been set in another circle.";
          delete element.businessObject.$attrs.violation4; 
          //delete element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation;
        //}
      }}
        if (String(violation4).match(/^InnerScope_[0-9]([a-z0-9]+)*$/) && !(String(violation4).match(/^InnerScope_[0-9]+$/))) {
         
          if((element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.akkuCheckbox 
            ||!isNaN(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation4) 
          || String(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation4).match(/^InnerScope_[0-9]([a-z0-9]+)*$/)) 
          && element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation4 != '' ){
          errorMessageV.violation4 = "Violation must not be set, because it has already been set in another circle.";
          delete element.businessObject.$attrs.violation4; 
          //delete element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation;
          
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
  description : 'Priority',
  label : 'Camera-Priority',
  modelProperty : 'prioritaet4',
  validate: function(element, values) {
    var prioritaet4 = values.prioritaet4;
    var errorMessageP = {};
    if(element.businessObject.$attrs.violation4 == undefined){
      errorMessageP.prioritaet4 = "Set violation attribute first.";
      delete element.businessObject.$attrs.prioritaet4;
    }

    if (isNaN(prioritaet4)) {
      errorMessageP.prioritaet4 = "Priority must be a number.";
      delete element.businessObject.$attrs.prioritaet4;
    }

    if(element.businessObject.attachedToRef.$type == 'bpmn:SubProcess'&&
        element.businessObject.attachedToRef.suitable == 100){
        // Index vom aktuellen Element
        var find;

        var kind;
        var li;
        for(var k = 0; k < element.parent.children.length; k++){
          if(element.parent.children[k].attachers !=null || element.parent.children[k].attachers !=undefined ){
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
        }

        
        var onlyChild = false;
        if(element.parent.children.length-1 == 1){
               onlyChild = true;
        }
        

        if(prioritaet4 < 0){
          errorMessageP.prioritaet4 = "Priority may not be less than 0.";
          delete element.businessObject.$attrs.prioritaet4;
        }
        if(!isNaN(element.businessObject.$attrs.prioritaet4) && (
          (element.businessObject.$attrs.prioritaet4 == element.businessObject.$attrs.prioritaet5)||
          (element.businessObject.$attrs.prioritaet4 == element.businessObject.$attrs.prioritaet3)||
          (element.businessObject.$attrs.prioritaet4 == element.businessObject.$attrs.prioritaet2) ||
          (element.businessObject.$attrs.prioritaet4 == element.businessObject.$attrs.prioritaet))){
            errorMessageP.prioritaet4 = "Priority must not be set because it has already been set in another circle.";
            delete element.businessObject.$attrs.prioritaet4;
          }

        if(!onlyChild){ 
          for(var i = 0; i<element.parent.children[kind].attachers[li].host.attachers.length; i++){
            // gibt violation vom anderen Kreis aus
            if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.id != element.id){
            if((element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.prioritaet4 >= 0 && prioritaet4 >= 0)) {
              errorMessageP.prioritaet4 = "Priority must not be set because it has already been set in another circle.";
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
  description : 'If situation is violated, jump to scope id.',
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
    for(var k = 0; k < element.parent.children.length; k++){
      if(element.parent.children[k].attachers !=null || element.parent.children[k].attachers !=undefined ){
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
    //console.log(values);
    
    
    //console.log(element.parent.children);
    if (!String(violation5).match(/^InnerScope_[0-9]([a-z0-9]+)*$/)) {
      errorMessageV.violation5 = "Not valid input, because the violation attribute should start with the prefix Innerscope_. Example InnerScope_1rj1vs7.";
      delete element.businessObject.$attrs.violation5; 
    }

    if(String(violation5).match(/^InnerScope_[0-9]([a-z0-9]+)*$/)){

      var matchFoundR = false, matchCircleR = false, matchCircleYR = false;
      var matchFoundG = false, matchCircleG = false, matchCircleYG = false;
      var scope;
      for(var i=0; i<element.parent.children.length; i++){
       // console.log(element.parent.children[kind].attachers[li].host);
        if(element.parent.children[i].id == violation5 &&
          element.parent.children[kind].attachers[li].host.id != violation5){
          scope = i;
          if(element.businessObject.suitable == 25){
         //   console.log("gg");
            for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
              var rot = false;
              if(element.parent.children[scope].attachers[j].businessObject.suitable == 25){
              if((element.parent.children[scope].attachers[j].businessObject.$attrs.violation5 == undefined)){
           //     console.log("vi");
                
               matchCircleR = true;
             //  console.log(matchCircleR);
            }
            
            }
            //console.log("va");
            //console.log(matchCircleR);
            }
            for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
              var rot = false;
              if(element.parent.children[scope].attachers[j].businessObject.suitable == 50){
              if(!(element.parent.children[scope].attachers[j].businessObject.$attrs.updateCheckbox)){
           //     console.log("vi");
                
               matchCircleYR = true;
             //  console.log(matchCircleR);
            }
            
            }
            //console.log("va");
            //console.log(matchCircleR);
            }
            for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
              //console.log(scope);
              //console.log()
              //console.log(element.parent.children[scope].attachers[j].businessObject.suitable);
              if(element.parent.children[scope].attachers[j].businessObject.suitable == 100){
                 matchFoundR = true;
                // console.log(100);
              }
            }  
            
          }
          if(element.businessObject.suitable == 100){
            //console.log(25);
            for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
              
              if(element.parent.children[scope].attachers[j].businessObject.suitable == 100){
                if((element.parent.children[scope].attachers[j].businessObject.$attrs.violation5 == undefined)){
              //    console.log(element.parent.children[scope].attachers[j].businessObject.$attrs.violation);
                 matchCircleG = true;
                // console.log(100);
              }
            }
            }
            for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
              var rot = false;
              if(element.parent.children[scope].attachers[j].businessObject.suitable == 50){
              if(!(element.parent.children[scope].attachers[j].businessObject.$attrs.updateCheckbox)){
           //     console.log("vi");
                
               matchCircleYG = true;
             //  console.log(matchCircleR);
            }
            
            }
            //console.log("va");
            //console.log(matchCircleR);
            }
            for(var j = 0; j< element.parent.children[scope].attachers.length; j++){
             // console.log(scope);
              if(element.parent.children[scope].attachers[j].businessObject.suitable == 25){
                 matchFoundG = true;
                // console.log(100);
              }
            } 
            
          }
    
    }
  }
  //console.log(!matchCircleR);
  //console.log(!matchFoundR);
  if(element.businessObject.suitable == 25){
      if((!matchCircleR || !matchFoundR) || !matchCircleYR){
        
    errorMessageV.violation5 = "Not valid input, because either the complementary circle is missing or an input in the circle of the same color has been made. ";
    delete element.businessObject.$attrs.violation5; 
  }
}
if(element.businessObject.suitable == 100){
if((!matchCircleG || !matchFoundG || !matchCircleYG)) {
      
  errorMessageV.violation5 = "Not valid input, because either the complementary circle is missing or an input in the circle of the same color has been made. ";
  delete element.businessObject.$attrs.violation5; 
} 
}

    
}
    if(!onlyChild){ 
      for(var i = 0; i<element.parent.children[kind].attachers[li].host.attachers.length; i++){
        // gibt violation vom anderen Kreis aus
        if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.id != element.id){
          if (String(violation5).match(/^InnerScope_[0-9]+$/)) {
            if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.upgradeCheckbox 
              ||(!isNaN(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation5)
               || String(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation5).match(/^InnerScope_[0-9]([a-z0-9]+)*$/)) 
               && element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation5 != '' ){
          
        //if((Number(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation) >= 0 && Number(violation) >= 0)) {
          errorMessageV.violation5 = "Violation must not be set, because it has already been set in another circle.";
          delete element.businessObject.$attrs.violation5; 
          //delete element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation;
        //}
      }}
        if (String(violation5).match(/^InnerScope_[0-9]([a-z0-9]+)*$/) && !(String(violation5).match(/^InnerScope_[0-9]+$/))) {
         
          if((element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.upgradeCheckbox 
            ||!isNaN(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation5) 
          || String(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation5).match(/^InnerScope_[0-9]([a-z0-9]+)*$/)) 
          && element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation5 != '' ){
          errorMessageV.violation5 = "Violation must not be set, because it has already been set in another circle.";
          delete element.businessObject.$attrs.violation5; 
          //delete element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.violation;
          
        }
      }

      }
    }
  }
    return errorMessageV;
  }}
})),
group.entries.push(entryFactory.textField({
  id : 'prioritaet5',
  description : 'Priority',
  label : 'Update-Priority',
  modelProperty : 'prioritaet5',
  validate: function(element, values) {
    var prioritaet5 = values.prioritaet5;
    var errorMessageP = {};

    if(element.businessObject.$attrs.violation5 == undefined){
      errorMessageP.prioritaet5 = "Set violation attribute first.";
      delete element.businessObject.$attrs.prioritaet5;
    }

    if (isNaN(prioritaet5)) {
      errorMessageP.prioritaet5 = "Priority must be a number.";
      delete element.businessObject.$attrs.prioritaet5;
    }

    if(element.businessObject.attachedToRef.$type == 'bpmn:SubProcess'&&
        element.businessObject.attachedToRef.suitable == 100){
        // Index vom aktuellen Element
        var find;

        var kind;
        var li;
        for(var k = 0; k < element.parent.children.length; k++){
          if(element.parent.children[k].attachers !=null || element.parent.children[k].attachers !=undefined ){
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
        }

        
        var onlyChild = false;
        if(element.parent.children.length-1 == 1){
               onlyChild = true;
        }
        

        if(prioritaet5 < 0){
          errorMessageP.prioritaet5 = "Priority may not be less than 0.";
          delete element.businessObject.$attrs.prioritaet5;
        }
        if(!isNaN(element.businessObject.$attrs.prioritaet5) && (
          (element.businessObject.$attrs.prioritaet5 == element.businessObject.$attrs.prioritaet4)||
          (element.businessObject.$attrs.prioritaet5 == element.businessObject.$attrs.prioritaet3)||
          (element.businessObject.$attrs.prioritaet5 == element.businessObject.$attrs.prioritaet2) ||
          (element.businessObject.$attrs.prioritaet5 == element.businessObject.$attrs.prioritaet))){
            errorMessageP.prioritaet5 = "Priority must not be set because it has already been set in another circle.";
            delete element.businessObject.$attrs.prioritaet5;
          }

        if(!onlyChild){ 
          for(var i = 0; i<element.parent.children[kind].attachers[li].host.attachers.length; i++){
            // gibt violation vom anderen Kreis aus
            if(element.parent.children[kind].attachers[li].host.attachers[i].businessObject.id != element.id){
            if((element.parent.children[kind].attachers[li].host.attachers[i].businessObject.$attrs.prioritaet5 >= 0 && prioritaet5 >= 0)) {
              errorMessageP.prioritaet5 = "Priority must not be set because it has already been set in another circle.";
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