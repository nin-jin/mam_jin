namespace $.$$ {
	
	$mol_style_define( $jin_keyboard, {
		
		flex: {
			direction: 'column',
		},
		
	} )
	
	$mol_style_define( $jin_keyboard_row, {
	} )
	
	$mol_style_define( $jin_keyboard_cell, {
		
		cursor: 'pointer',
		
		touchAction: 'none',
		
		':hover': {
			background: {
				color: $mol_theme.hover,
			},
		},
		
		align: {
			items: 'center',
		},
		
		justify: {
			content: 'center',
		},
		
		box: {
			shadow: [[0, 0, 0, `1px`, $mol_theme.line ]],
		},
		
		width: `2.5rem`,
		height: `2.5rem`,
		
		border: {
			radius: $mol_gap.round,
		},
		
	} )
	
}
