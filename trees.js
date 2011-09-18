(function(){		
	var sketch = function($p) {  
		var leafColor = $p.color(50,115,21), treeColors = [], trees = [];
		
		$p.smooth();
		$p.frameRate(30);
		$p.setup = function(){	
			treeColors = [
				$p.color(115,87,2),
				$p.color(120,103,52),
				$p.color(120,103,52),
				$p.color(115,87,2),
				$p.color(122,113,86),
				$p.color(117,104,43)
			];
			
			$(window).resize(function(){
				var w = $(window).width(), h = $(window).height();
				if (w != $p.width || h != $p.height) {									
					$p.size(w,h);
					$p.draw();	
				}			
			}).resize();		
		};
		
		var Tree = 	function (ix, iy) {
			if (!(this instanceof Tree)){
				return new Tree();
			}
			
			var isFullGrown = false, growthFactor = 0;
			
			var defaults = {
				x: ix,
				y: iy,
				trunkHeight: 0,
				trunkWidth: 0,	
				theta: $p.radians($p.random(15,40)),
				maxTrunkHeight: $p.random(55,90),
				branchFactor: $p.random(0.5,0.66),					
				maxTrunkWidth: $p.random(3,9),
				branchMinLength: $p.random(2,6),				
				treeColor: treeColors[parseInt($p.random(0,5))]					
			};
			
			$.extend(this,defaults);	
			this.hasMoreLeafes = this.branchMinLength < 4 && this.maxTrunkHeight > 60||this.theta > 0.610865238;
			
			this.update = function(){			
				if(!isFullGrown){
					growthFactor = (growthFactor >= 1.0) ? 1.0 : growthFactor + 0.02;
					this.trunkWidth = this.maxTrunkWidth * growthFactor;
					this.trunkHeight = this.maxTrunkHeight * growthFactor;
					if(this.trunkWidth == this.maxTrunkWidth&&this.trunkHeight==this.maxTrunkHeight){
						isFullGrown = true;
					}
				}
			};
			this.render = function(){
				$p.noStroke();
				$p.fill(this.treeColor);
				$p.pushMatrix();
				$p.translate(this.x,this.y);
				$p.rect(0,0,this.trunkWidth,-this.trunkHeight-(this.trunkWidth*0.5))
				$p.translate(this.trunkWidth/2-(this.trunkWidth*this.branchFactor)/2,-this.trunkHeight);
				this.branch(this.trunkWidth,this.trunkHeight);			
				$p.popMatrix();
			}
			this.branch = function (w, h) {						
				h *= this.branchFactor;
				w *= this.branchFactor;
				if(w < 1.0){
					w = 1.0;
				}
		
				if (h > this.branchMinLength) {	
					var branchTrunkRatio = (this.trunkHeight - h) / this.trunkHeight;
					var leafSize = 0.0;
					$p.pushMatrix();
					$p.rotate(this.theta);
					$p.rect(0,0,w,-h-(w*0.5));
					$p.translate(w/2-(w*this.branchFactor)/2,-h);
					if(this.hasMoreLeafes){
						leafSize = (50/this.branchMinLength)*growthFactor*branchTrunkRatio;
						$p.fill(leafColor,100*growthFactor*branchTrunkRatio);
						$p.ellipse(0, 0, leafSize, leafSize);
					}
					$p.fill(leafColor,180);
					leafSize = 5.5*growthFactor;
					$p.ellipse(0, 0, leafSize, leafSize);
					$p.fill(this.treeColor);
					this.branch(w,h);
					$p.popMatrix();
					$p.pushMatrix();
					$p.rotate(-this.theta);
					$p.rect(0,0,w,-h-(w*0.5));
					$p.translate(w/2-(w*this.branchFactor)/2,-h);
					this.branch(w,h);
					$p.popMatrix();	
				}
			}
		}; 
		
		var instructions = (function(){
			var textBefore = 'Click on the screen to plant a tree.',
				textAfter = 'Click again to plant more trees.',
				mousePressed = false,
				fadingOut = false,
				fade = 1.0;				
			
			return {
				onMousePressed: function(){
					if(!mousePressed){
						mousePressed = fadingOut = true;
					}
				},
				draw: function(){
					if(!mousePressed){
						$p.textSize(30);	
						$p.textAlign($p.CENTER);
						$p.text(textBefore,$p.width/2,$p.height/2);					
					}
					else{
						if(fadingOut){
							fade = fade <= 0 ? 0 : fade - 0.05;			
							$p.fill(255,255*fade);
							$p.text(textBefore,$p.width/2,$p.height/2);		
							if(fade == 0.0){
								fadingOut = false;
							}
						}
						else{
							$p.textSize(20);			
							fade = fade >= 1 ? 1 : fade + 0.05;	
							$p.fill(255,255*fade);
							$p.text(textAfter,$p.width/2,40);
						}
					}
				}
			}
		})();
		
		$p.draw = function(){
			$p.background(0,0);
			instructions.draw();
			for(var i=0; i < trees.length; i++) {  		
				var tree = trees[i];
				tree.update();  
				tree.render();  
			} 
		};
		
		$p.mousePressed = function(){ 
			instructions.onMousePressed();
			trees.push(new Tree($p.mouseX, $p.mouseY));
		};
	};
	
	$(function(){    				
		var canvas = document.getElementById('sketch');
		new Processing(canvas, sketch);
	});
})();