namespace $.$$ {
	
	export class $jin_keyboard extends $.$jin_keyboard {
		
		row_layout( id: string ) {
			const layouts = this.layouts()
			const layout = layouts[ this.layout() as never ] ?? layouts[ '' ]
			return layout[ Number( id ) ]
		}
		
		row_turn( id: string, next?: CompositionEvent ) {
			if( !next ) return
			this.turn( next )
		}
		
		turn( next?: CompositionEvent ) {
			if( !next ) return
			const el = this.area().dom_node() as HTMLInputElement
			el.focus()
			this.layout( next.data )
		}
		
		row_input( id: string, next?: InputEvent ) {
			if( !next ) return
			this.input( next )
		}
		
		input( next?: InputEvent ) {
			if( !next ) return
			
			let val = next.data!
			
			const el = this.area().dom_node() as HTMLInputElement
			let sel_start = el.selectionStart ?? 0
			let sel_end = el.selectionEnd ?? 0
			
			let before = el.value.slice( 0, sel_start )
			let sel = el.value.slice( sel_start, sel_end )
			let after = el.value.slice( sel_end )
			
			switch( val ) {
				
				case '⏮':
					el.selectionEnd = 0
					this.layout( '' )
					return
				
				case '🔠':
					this.upcase( true )
					this.layout( '' )
					return
				
				case '⏭':
					el.selectionStart = 9999
					this.layout( '' )
					return
				
				case '◀':
					el.selectionEnd = sel_start - 1
					this.layout( '' )
					return
				
				case '▶':
					el.selectionStart = sel_end + 1
					this.layout( '' )
					return
				
				case '🤛':
					if( !sel ) before = before.slice( 0, -1 )
					val = ''
					break
				
				case '🔻':
					val = '\n'
					break
				
				case '🤜':
					if( !sel ) after = after.slice( 1 )
					val = ''
					break
				
			}
			
			if( !this.upcase() ) val = val.toLowerCase()
			
			el.value = before + val + after
			
			el.selectionStart = el.selectionEnd = before.length + val.length
			el.dispatchEvent( next )
			
			this.layout( '' )
			this.upcase( false )
			
		}
		
	}
	
	export class $jin_keyboard_row extends $.$jin_keyboard_row {
		
		cell_title( id: string ) {
			return this.layout()[ Number( id ) ]
		}
		
		cell_turn( id: string, next?: InputEvent ) {
			if( !next ) return
			this.turn( next )
		}
		
		cell_input( id: string, next?: InputEvent ) {
			if( !next ) return
			this.input( next )
		}
		
	}
	
	export class $jin_keyboard_cell extends $.$jin_keyboard_cell {
		
		title() {
			let title = super.title().replaceAll( '', '' )
			if( !this.upcase() ) title = title.toLowerCase()
			return title
		}
		
		start( next?: PointerEvent ) {
			if( !next ) return
			next.preventDefault()
			this.dom_node().releasePointerCapture( next.pointerId )
			this.turn( new CompositionEvent( 'compositionstart', { data: this.symbol() } ) )
		}
		
		end( next?: Event ) {
			if( !next ) return
			this.input( new InputEvent( 'input', { data: this.symbol() } ) )
		}
		
		abort( next?: Event ) {
			if( !next ) return
			this.input( new InputEvent( 'input', { data: '' } ) )
		}
		
	}
	
}
