	//Desenvolvido por Antonio Carlos -The Maze-

	/* Constantes do Sistema*/
	const CANVAS = document.querySelector("CANVAS");		//Pegar elemento
	const CONTEXTO = CANVAS.getContext("2d");				//Criar contexto 2d
	const WIDTH = CANVAS.width, HEIGHT = CANVAS.height;		//Pegar dimensões do elemento
	const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;		//Definir movimento pela tabela ASCII
	const A = 65, W = 87, D = 68, S = 83;					//Definir movimento pela tabela ASCII
	/* #################### */

	/* variáveis de configuração */
	var characterSpeed = 5;									//Quanto menor, mais lento  (<=0 : bug)
	var animationSpeed = 2;									//Quanto menor, mais rápido (<=0 : bug)
	var tileSize = 64;										//Tamanho renderizado no mapa
	var tileSrcSize = 96;									//Tamanho padrão do tile
	var camPorcentLeft = camPorcentTop = 0.50;				// |'''
	var camPorcentRight = camPorcentBottom = 0.50;			//  ...|
	var faseAtual = 1;
	/* ######################### */

	/* variáveis do sistema */
	var mvLeft = mvUp = mvRight = mvDown = false;			//definindo movimento desabilitado
	var invOpen = false;									//check if invenctory is open
	var onlyOne = false;									//pass thru if last portal condicional one time
	/* #################### */

	/* type guide
	0 = intengível.
	1 = hitbox
	2 = portal.
	3 = item.
	*/

	/*
	// ##### BANCO DE DADOS DOS OBJETOS #####
	*/

	var tileSet = {
		inventario: {
			3: {getItem: false},
			4: {getItem: false}
		},
		object: function(id) {
			switch (id) {
				case -1:
					return {
						nm: "Nulo",
						id: -1,
						type: -1,
						b_height: 96,
						b_width: 96,
						t_size_h: 64,
						t_size_w: 64
					}
				case 0:
					return {
						nm: "Chão",
						id: 0,
						type: 0,
						b_height: 96,
						b_width: 96,
						t_size_h: 64,
						t_size_w: 64
					}
				case 1:
					return {
						nm: "Parede",
						id: 1,
						type: 1,
						b_height: 96,
						b_width: 96,
						t_size_h: 64,
						t_size_w: 64
					}
				case 2:
					return {
						nm: "Portal",
						id: 2,
						type: 2,
						b_height: 96,
						b_width: 96,
						t_size_h: 64,
						t_size_w: 64
					}
				case 3:
					return {
						nm: "Chave simples",
						id: 3,
						type: 3,
						b_height: 96,
						b_width: 96,
						t_size_h: 64,
						t_size_w: 64,
						getItem: this.inventario[3].getItem
					}
				case 4:
					return {
						nm: "Chave para nível 2",
						id: 4,
						type: 3,
						b_height: 96,
						b_width: 96,
						t_size_h: 64,
						t_size_w: 64,
						getItem: this.inventario[4].getItem
					}
				case 5:
					return {
						nm: "goal",
						id: 5,
						type: 5,
						b_height: 96,
						b_width: 96,
						t_size_h: 64,
						t_size_w: 64
					}
				case 6:
					return {
						nm: "paradechao",
						id: 6,
						type: 0,
						b_height: 96,
						b_width: 96,
						t_size_h: 64,
						t_size_w: 64
					}
			}
		}
	};

	// FUNÇÃO PRA TROCAR O OBJETO DO MAPA
	function switchObject(id, col, row) {
		dicas(id);
		switch (id) {
			case 3:
				stages[faseAtual][row][col] = 0;
				tileSet.inventario[id].getItem = true;
				break;
			case 4:
				stages[faseAtual][row][col] = 0;
				tileSet.inventario[id].getItem = true;
				onlyOne = true;
				break;
		}
	}

	async function dicas(id) {
		switch (id) {
			case 3:
				await new Promise(r => setTimeout(r, 2500));
				var modalTip = {
					position: 'top-end',
					icon: 'info',
					title: "<span class=modal>Dica: agora você pode atravessar portais!</span>",
					showConfirmButton: false,
					timer: 3000,
					timerProgressBar: true,
					onOpen: (toast) => {
						toast.addEventListener('mouseenter', Swal.stopTimer)
						toast.addEventListener('mouseleave', Swal.resumeTimer)
					},
					toast: true,
					padding: "0.8rem 2rem"
				};
				Swal.fire(modalTip);
				break;
			case 5:
				var modalTip = {
					position: 'top-end',
					icon: 'info',
					title: "<span class=modal>Tente novamente!</span>",
					showConfirmButton: false,
					timer: 3000,
					timerProgressBar: true,
					onOpen: (toast) => {
						toast.addEventListener('mouseenter', Swal.stopTimer)
						toast.addEventListener('mouseleave', Swal.resumeTimer)
					},
					toast: true,
					padding: "0.8rem 2rem"
				};
				Swal.fire(modalTip);
				break;
		}
	}

	function renderItems(word) {
		var inv = tileSet.inventario;
		if (word == 'clear') {
			for (i in inv) {
				if (inv[i].getItem == true) {
					inv[i].getItem = false;
				}
			}
			renderItems()
		} else {
			for (i in inv) {
				if (inv[i].getItem == true) {
					var invPop = document.getElementById('item'+i);
					var itemName = "<img src=img/objects/"+i+".png>"
					invPop.innerHTML += itemName;
				}				
			}
		}
	}

	function inventarioOpen(op) {
		if (op === 1) {
			Swal.fire({
				title: '<span class=invTitle>Inventário</span>',
				html:
				'<div class=inventario id=inventario>' +
				'<div id=item1 class=itemInv>&nbsp;</div>' +
				'<div id=item2 class=itemInv>&nbsp;</div>' +
				'<div id=item3 class=itemInv>&nbsp;</div>' +
				'<div id=item4 class=itemInv>&nbsp;</div><br>' +
				'<div id=item5 class=itemInv>&nbsp;</div>' +
				'<div id=item6 class=itemInv>&nbsp;</div>' +
				'<div id=item7 class=itemInv>&nbsp;</div>' +
				'<div id=item8 class=itemInv>&nbsp;</div>' +
				'</div>',
				showCloseButton: true,
				showCancelButton: false,
				showConfirmButton: false,
				focusConfirm: false
			})
			renderItems()
		} else {
			Swal.close()
		}
	}
	
	//Conseguir a imagem para o TileSet
	var img = new Image();
		img.src = "img/img.png";
		img.addEventListener("load",function(){
			requestAnimationFrame(loop,CANVAS);
		},false);
	
	var walls = [];
	
	var player = {
		x: tileSize + 2,
		y: tileSize + 2,
		width: 24,
		height: 32,
		speed: characterSpeed,
		srcX: 0,
		srcY: tileSrcSize,
		countAnim: 0
	};

	var stages = {
		1: [
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,3,1,0,0,0,0,0,1,1,0,0,0,0,0,1,5,1],
			[1,0,0,0,1,0,0,0,0,0,2,1,0,0,0,0,0,1,1,1],
			[1,0,0,2,1,0,0,0,0,0,1,1,0,0,0,0,0,1,2,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,0,1],
			[1,0,0,0,0,1,2,0,0,0,0,1,2,0,0,0,0,1,0,1],
			[1,0,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,0,1],
			[1,0,0,0,0,1,1,0,0,1,0,0,0,0,1,0,0,0,0,1],
			[1,0,0,0,0,2,1,0,0,1,1,0,0,2,1,0,0,0,0,1],
			[1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
			[1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,0,2,1,0,0,0,0,0,1,2,0,0,0,0,0,1],
			[1,0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,0,0,0,1],
			[1,0,1,1,1,0,1,0,0,0,0,2,1,0,2,1,2,0,0,1],
			[1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,0,0,1,2,0,0,0,0,1,0,0,0,0,2,0,1],
			[1,0,0,0,0,0,1,0,0,0,0,0,1,2,0,0,0,0,0,1],
			[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
			[1,0,4,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
		],
		2: [
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
		],
		3: [
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,0,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1],
			[1,0,0,0,0,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		],
		4: [
			[1,1,1,1,1],
			[1,0,0,0,1],
			[1,0,0,0,1],
			[1,0,0,0,1],
			[1,1,1,1,1]
		]
	};

	const T_WIDTH = stages[faseAtual][0].length * tileSize,
		  T_HEIGHT = stages[faseAtual].length * tileSize;

	tileManager('apply');

	function tileManager(funcao) {
		switch (funcao) {
			case 'apply':
				for(var row in stages[faseAtual]){
					for(var column in stages[faseAtual][row]){
						var tile = stages[faseAtual][row][column];
						var block = tileSet.object(tile);
						var check = block.type;
						if (check === 1 || check === 2 || check === 3 || check === 4 || check === 5) {
							var wall = {
								col: column,
								row: row,
								id: block.id,
								type: block.type,
								x: block.t_size_w*column,
								y: block.t_size_h*row,
								width: block.t_size_w,
								height: block.t_size_h
							};
							walls.push(wall);
						}
					}
				}
			break;
			case 'delete':
				for(var row in stages[faseAtual]){
					for(var column in stages[faseAtual][row]){
						var wall = {}
						walls.shift(wall);
					}
				}
			break;
		}
	}

	//OBJETO CAMERA
	
	var cam = {
		x: 0,
		y: 0,
		width: WIDTH,
		height: HEIGHT,
		innerLeftBoundary: function(){
			return this.x + (this.width*camPorcentLeft);
		},
		innerTopBoundary: function(){
			return this.y + (this.height*camPorcentTop);
		},
		innerRightBoundary: function(){
			return this.x + (this.width*camPorcentBottom);
		},
		innerBottomBoundary: function(){
			return this.y + (this.height*camPorcentRight);
		}
	};

	function onTouchObject(player, wall){
		var type = wall.type, id = wall.id, col = wall.col, row = wall.row;

		var distX = (player.x + player.width/2) - (wall.x + wall.width/2);
		var distY = (player.y + player.height/2) - (wall.y + wall.height/2);

		var getChave =  tileSet.object(3).getItem;
		var getFinal =  tileSet.object(4).getItem;
		var get =  tileSet.object(id).getItem;
		
		var sumWidth = (player.width + wall.width)/2;
		var sumHeight = (player.height + wall.height)/2;

		var avisoModal = {
			position: 'bottom-end',
			icon: 'success',
			title: "<span class=modal>Item adquirido <span class=item>" + tileSet.object(id).nm + "</span></span>",
			showConfirmButton: false,
			timer: 2500,
			toast: true,
			padding: "0.8rem 2rem"			
		};
		
		if(Math.abs(distX) < sumWidth && Math.abs(distY) < sumHeight){
			var overlapX = sumWidth - Math.abs(distX);
			var overlapY = sumHeight - Math.abs(distY);
			
			//hitbox 
			if (overlapX > overlapY && type === 1){
				player.y = distY > 0 ? player.y + overlapY : player.y - overlapY;
			} else if (overlapX < overlapY && type === 1) {
				player.x = distX > 0 ? player.x + overlapX : player.x - overlapX;
			}
			
			//entrar no portal de teletransporte
			if (overlapX > overlapY && type === 2 && getChave){
				player.y = distY > 0 ? wall.y - 90 : wall.y + 128;
			} else if (overlapX < overlapY && type === 2 && getChave){
				player.x = distX > 0 ? wall.x - 90 : wall.x + 128;
			}

			//entrar no portal final
			if (overlapX > overlapY && type === 5 && getFinal && onlyOne){
				onlyOne = false;
				nextStage();
			} else if (overlapX < overlapY && type === 5 && getFinal && onlyOne){
				onlyOne = false;
				nextStage();
			} else if (overlapX < overlapY && type === 5 && getFinal==false) {
				dicas(id);
				player.x = 68;
				player.y = 68;
			}
			
			//pegar itens
			if (overlapX > overlapY && type === 3 && get==false){
				Swal.fire(avisoModal);					
				switchObject(id, col, row);
			} else if (overlapX < overlapY && type === 3 && get==false){
				Swal.fire(avisoModal);
				switchObject(id, col, row);
			}
		}
	}
	
	window.addEventListener("keydown", keydownHandler, false);
	window.addEventListener("keyup", keyupHandler, false);
	window.addEventListener("keypress", atalhos, false);

	function atalhos(){
		var evento = window.event;
		var ascii = evento.which;
		var chave = String.fromCharCode(ascii);
		
		if ((chave == 'b' || chave == 'B') && invOpen==false) {
			invOpen = true;
			inventarioOpen(1);
		} else {
			if ((chave == 'b' || chave == 'B') && invOpen==true) {
				invOpen = false;
				inventarioOpen(0);
			}
		}
	}
	
	function keydownHandler(e){
		var key = e.keyCode;
		switch(key){
			case LEFT: case A:
				mvLeft = true;
				break;
			case UP: case W:
				mvUp = true;
				break;
			case RIGHT: case D:
				mvRight = true;
				break;
			case DOWN: case S:
				mvDown = true;
				break;
		}
	}
	
	function keyupHandler(e){
		var key = e.keyCode;
		switch(key){
			case LEFT: case A:
				mvLeft = false;
				break;
			case UP: case W:
				mvUp = false;
				break;
			case RIGHT: case D:
				mvRight = false;
				break;
			case DOWN: case S:
				mvDown = false;
				break;
		}
	}

	function nextStage() {
		number = 1 + parseInt(faseAtual);
		Swal.fire({
			position: 'center',
			icon: 'success',
			title: '<span class=modal>Parabéns!</span>',
			showConfirmButton: true,
			allowOutsideClick: false,
			confirmButtonText: "Ir para "+number+"ª fase"
		  }).then((result) => {
			if (result.value) {
				renderItems('clear');
				faseAtual++;
				tileManager('delete');
				tileManager('apply');
				player.x = 68;
				player.y = 68;
			}
		  })
		  
	}
	
	function update(){
		if(mvLeft && !mvRight){
			player.x -= player.speed;
			//ajuste de orientação da animação para esquerda
			player.srcY = tileSrcSize + player.height * 2;
		} else 
		if(mvRight && !mvLeft){
			player.x += player.speed;
			//ajuste de orientação da animação para direita
			player.srcY = tileSrcSize + player.height * 3;
		}
		if(mvUp && !mvDown){
			player.y -= player.speed;
			//ajuste de orientação da animação para cima
			player.srcY = tileSrcSize + player.height * 1;
		} else 
		if(mvDown && !mvUp){
			player.y += player.speed;
			//ajuste de orientação da animação para baixo
			player.srcY = tileSrcSize + player.height * 0;
		}
		
		//processo de animação
		if(mvLeft || mvRight || mvUp || mvDown){
			player.countAnim++;
			
			if(player.countAnim >= animationSpeed*8){
				player.countAnim = 0;
			}
			
			player.srcX = Math.floor(player.countAnim/animationSpeed) * player.width;
		} else {
			player.srcX = 0;
			player.countAnim = 0;
		}
		
		for(var i in walls){
			var wall = walls[i];
			onTouchObject(player, wall);
		}

		//PARTE DA CAMERA ABAIXO \/
		if(player.x < cam.innerLeftBoundary()){
			cam.x = player.x - (cam.width * camPorcentLeft);
		}
		if(player.y < cam.innerTopBoundary()){
			cam.y = player.y - (cam.height * camPorcentTop);
		}
		if(player.x + player.width > cam.innerRightBoundary()){
			cam.x = player.x + player.width - (cam.width * camPorcentRight);
	 	}
		if(player.y + player.height > cam.innerBottomBoundary()){
			cam.y = player.y + player.height - (cam.height * camPorcentBottom);
		}

		//CORREÇÃO DE EXTREMIDADES
		cam.x = Math.max(0,Math.min(T_WIDTH - cam.width,cam.x));
		cam.y = Math.max(0,Math.min(T_HEIGHT - cam.height,cam.y));
	}
	
	function render(){
		CONTEXTO.clearRect(0,0,WIDTH,HEIGHT);
		CONTEXTO.save();
		CONTEXTO.translate(-cam.x,-cam.y);
		for(var row in stages[faseAtual]){
			for(var column in stages[faseAtual][row]){
				var tile = stages[faseAtual][row][column];
				var block = tileSet.object(tile);
				var x = column*block.t_size_w;
				var y = row*block.t_size_h;
				//renderizar objetos (blocos ou items)
				CONTEXTO.drawImage(
					img,
					block.id * block.b_width, 0, block.b_width, block.b_height,
					x, y, block.t_size_w, block.t_size_h
				);
			}
		}
		//desenha o personagem
		CONTEXTO.drawImage(
			img,
			player.srcX,player.srcY,player.width,player.height,
			player.x,player.y,player.width,player.height
		);
		CONTEXTO.restore();
	}
	
	function loop(){
		update();
		render();
		requestAnimationFrame(loop,CANVAS);
	}