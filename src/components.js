Crafty.c('Grid', {
	init: function(){
		this.attr({
			w: Game.map_grid.tile.width,
			h: Game.map_grid.tile.height
		});
	},

	// Locate an entity via coords.
	at: function( x, y ){
		if ( x === undefined && y === undefined )
		{
			return {
				x: this.x / Game.map_grid.tile.width,
				y: this.y / Game.map_grid.tile.height
			};
		}
		else
		{
			this.attr({
				x: x * Game.map_grid.tile.width,
				y: y * Game.map_grid.tile.height
			});
			return this;
		}
	}
});

Crafty.c('Actor', {
	init: function(){
		this.requires( '2D, Canvas, Grid' );
	}
});

Crafty.c('Tree', {
	init: function(){
		this.requires( 'Actor, Solid, spr_tree' );
	}
});

Crafty.c('Bush', {
	init: function(){
		this.requires( 'Actor, Solid, spr_bush' );
	}
});

Crafty.c('Rock', {
	init: function(){
		this.requires( 'Actor, Solid, spr_rock' );
	}
});

Crafty.c('PlayerCharacter', {
	init: function(){
		this.requires( 'Actor, Fourway, Collision, spr_player, SpriteAnimation' )
			.fourway( 2 )
			.stopOnSolids()
			.onHit( 'Village', this.visitVillage )
			.reel( 'PlayerMovingUp', 400, 0, 0, 2 )
			.reel( 'PlayerMovingRight', 400, 0, 1, 2 )
			.reel( 'PlayerMovingDown', 400, 0, 2, 2 )
			.reel( 'PlayerMovingLeft', 400, 0, 3, 2 );

		this.bind( 'NewDirection', function( data ){
			if ( data.x > 0 )
			{
				this.animate( 'PlayerMovingRight', -1 );
			}
			else if ( data.x < 0 )
			{
				this.animate( 'PlayerMovingLeft', -1 );
			}
			else if ( data.y > 0 )
			{
				this.animate( 'PlayerMovingDown', -1 );
			}
			else if ( data.y < 0 )
			{
				this.animate( 'PlayerMovingUp', -1 );
			}
			else
			{
				this.pauseAnimation();
			}
		});
	},

	stopOnSolids: function(){
		this.onHit( 'Solid', this.stopMovement );
		return this;
	},

	stopMovement: function(){
		this._speed = 0;
		if ( this._movement )
		{
			this.x -= this._movement.x;
			this.y -= this._movement.y;
		}
	},

	visitVillage: function( data ){
		village = data[0].obj;
		village.collect();
	}
});

Crafty.c('Village', {
	init: function(){
		this.requires( 'Actor,  spr_village' );
	},

	collect: function(){
		this.destroy();
		Crafty.audio.play( 'knock' );
		Crafty.trigger( 'VillageVisited', this );
	}
});