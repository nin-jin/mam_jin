namespace $ {
	
	export function $jin_fulog_match(
		this: $,
		left: $mol_tree2,
		right: $mol_tree2,
	) {
		
		const left_subs = new Map< string, $mol_tree2 >()
		const right_subs = new Map< string, $mol_tree2 >()
		
		const match = ( left: $mol_tree2, right: $mol_tree2 )=> {
			
			if( left.type[0] === '@' ) {
				
				const con = left_subs.get( left.type )
				if( con && con.type !== right.type ) return false
				
				left_subs.set( left.type, right )
				
			}
			
			// if( right.type[0] === '@' ) {
				
			// 	const abs = right_subs.get( right.type )
			// 	if( abs && abs.type !== left.type ) return false
				
			// 	right_subs.set( right.type, left.clone([]) )
				
			// }
				
			if( left.type[0] !== '@' && left.type !== right.type ) return false
			// if( left.type[0] !== '@' && right.type[0] !== '@' && left.type !== right.type ) return false
			
			if( !left.kids.length ) return true
			if( left.kids.length !== right.kids.length ) return false
			
			for( let i = 0; i < right.kids.length; ++ i ) {
				if( !match( left.kids[i], right.kids[i] ) ) return false
			}
			
			return true
		}
		
		return match( left, right )
			? [ left_subs, right_subs ] as const
			: null
	}
	
	export function $jin_fulog_match_dump(
		this: $,
		root: $mol_tree2,
		map: Map< string, $mol_tree2 >,
	) {
		const kids = [] as $mol_tree2[]
		for( const [ name, val ] of map ) {
			kids.push( val.struct( name, [ val ] ) )
		}
		return root.clone( kids )
	}
	
}
