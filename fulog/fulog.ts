namespace $ {
	
	export function $jin_fulog_solve(
		this: $,
		input: $mol_tree2,
	) {
		
		const universe = [] as $mol_tree2[]
		
		const subst = (
			input: $mol_tree2,
			map: Map< string, $mol_tree2 >,
		)=> input.clone( input.hack({
			'': ( node, belt )=> {
				const kids = node.hack( belt )
				const output = map.get( node.type ) ?? node
				return [ output.clone( kids ) ]
			}
		}) )
		
		const ask = (
			query: $mol_tree2,
			path: $mol_tree2[] = [],
		) => {
			
			// Check for self reference
			const query_string = query.toString()
			if( path.some( past => past.toString() === query_string ) ) {
				return query.struct( '?', [ ... path, query ] )
			}
			
			check_facts: for( const fact of universe ) {
				
				for( const proposition of fact.kids ) {
					
					if( proposition.type === '/' ) continue
					
					const [ concrete, abstract ] = this.$jin_fulog_match( proposition, query ) ?? [ null, null ]
					if( !concrete ) continue
					
					const conditions = fact.select( '/', null ).kids
					
					const subpath = [ ... path, query ]
					const reasons = [] as $mol_tree2[]
					
					for( const cond of conditions ) {
						
						const res = infer( subst( cond, concrete ), subpath )
						if( res.type !== cond.type ) continue check_facts
						
						reasons.push( res.struct( '$', res.kids ) )
					}
					
					const dump = $$.$jin_fulog_match_dump( fact, concrete )
					
					return query.clone([
						dump.clone([ ... dump.kids, ... reasons ])
					])
					
				}
				
			}
			
			return query.struct( '?', [ ... path, query ] )
		}
		
		const infer = (
			hypothesis: $mol_tree2,
			path: $mol_tree2[] = [],
		) => {
			
			const positive = ask( hypothesis.struct( '+', hypothesis.kids ), path )
			const negative = ask( hypothesis.struct( '-', hypothesis.kids ), path )
			
			type Fulog = '+' | '-' | '?' | '!'
			
			const resolution = {
				
				'++': '!',
				'+-': '!',
				'+?': '+',
				'+!': '+',
				
				'-+': '!',
				'--': '!',
				'-?': '!',
				'-!': '!',
				
				'?+': '+',
				'?-': '-',
				'??': '?',
				'?!': '+',
				
				'!+': '!',
				'!-': '-',
				'!?': '-',
				'!!': '!',
				
			}[ positive.type + negative.type ] as string
			
			switch( resolution ) {
				case '+': return positive
				case '-': return negative
				case '?': return hypothesis.struct( '?', [ positive, negative ] )
				case '!': return hypothesis.struct( '!', [ positive, negative ] )
				default: throw new Error( 'Unknown resolution' )
			}
			
		}
		
		
				// const belt = {} as $mol_tree2_belt<{}>
				// for( const key in map.concrete ) {
				// 	belt[ key ] = input => [ input.struct( map[key].type, input.hack( belt ) ) ]
				// }
				
				// const deps = fact.list(
				// 	fact.clone([
				// 		... fact.kids.slice(1),
				// 		... query.kids.slice(1),
				// 	]).hack( belt )
				// )
				
				// if( !deps.kids.length ) {
				// 	// No more proof is required. Return last fact resolution.
				// 	return fact.list([ fact.struct( fact.span.toString(), [ $mol_tree2_from_json( map ) ] ) ])
				// }
				
				// const proof = this.ask( deps, [ query, ... path ] )
				// if( proof ) {
					
				// 	// Proof found. Append other facts to it.
				// 	return fact.list([
				// 		fact.struct( fact.span.toString(), [ $mol_tree2_from_json( map ) ] ),
				// 		... proof.kids,
				// 	])
					
				// }
				
			// }
			
			// if( positive ) return positive
			// if( negative ) return negative
			
			// // Proof doesn't found, return Unknown
			// return query.struct( '?', irrelevant )
			
		// }
		
		for( const fact of input.kids ) {
			
			const proposition = fact.kids[0]
			if( !proposition ) {
				universe.push( fact )
				continue
			}
			
			const res = infer( proposition )
			
			if( res.type === '?' ) {
				universe.push( fact )
			} else if( res.type === '!' ) {
				$mol_fail( res.error( 'Absurd fact' ) )
			} else if( res.type !== proposition.type ) {
				if( proposition.type === '?' ) {
					universe.push(
						fact.clone([ res.clone( proposition.kids ), res.struct( '$', res.kids ) ])
					)
				} else {
					universe.push(
						fact.clone([ res.struct( '!', [ proposition ] ), res.struct( '$', res.kids ) ])
					)
				}
			} else {
				$mol_fail( fact.error( 'Redundant fact' ) )
			}
			
		}
		
		return input.list( universe )
		
	}
	
// 	export function $jin_fulog_proof(
// 		universe: $mol_tree2,
// 		query: $mol_tree2,
// 		path: $mol_tree2[] = [],
// 	): $mol_tree2 | null {
// // console.log(query.toString()); debugger

// 		if( path.some( past => past.toString() === query.toString() ) ) {
// 			// Cyclic dependency
// 			console.log( query.list([ ... path, query ]).toString() )
// 			return null
// 		}

// 		const first = query.kids[0]
// 		for( const fact of universe.kids ) {
			
// 			const map = Object.create(null) as Record< string, string >
			
// 			const match = ( probe: $mol_tree2, ref: $mol_tree2 )=> {
				
// 				if( probe.type[0] === '@' ) {
					
// 					if( probe.type in map ) {
// 						if( map[ probe.type ] !== ref.type ) return false
// 					}
					
// 					map[ probe.type ] = ref.type
					
// 				} else if( ref.type[0] === '@' ) {
					
// 					if( ref.type in map ) {
// 						if( map[ ref.type ] !== probe.type ) return false
// 					}
					
// 					map[ ref.type ] = probe.type
					
// 				} else {
// 					if( probe.type !== ref.type ) return false
// 				}
				
// 				for( let i = 0; i < ref.kids.length; ++ i ) {
// 					if( !probe.kids[i] ) return false
// 					if( !match( probe.kids[i], ref.kids[i] ) ) return false
// 				}
				
// 				return true
// 			}
			
// 			if( match( fact, first ) ) {
				
// 				const belt = {} as $mol_tree2_belt<{}>
				
// 				for( const key in map ) {
// 					belt[ key ] = input => [ input.struct( map[key], input.hack( belt ) ) ]
// 				}
				
// 				const deps = fact.list( fact.clone([ ... fact.kids.slice(1), ... query.kids.slice(1) ]).hack( belt ) )
// 				if( !deps.kids.length ) {
// 					// No more proof is required. Return last fact resolution.
// 					return fact.list([ fact.struct( fact.span.toString(), [ $mol_tree2_from_json( map ) ] ) ])
// 				}
				
// 				const proof = $jin_fulog_proof( universe, deps, [ query, ... path ] )
// 				if( proof ) {
					
// 					// Proof found. Append other facts to it.
// 					return fact.list([
// 						fact.struct( fact.span.toString(), [ $mol_tree2_from_json( map ) ] ),
// 						... proof.kids,
// 					])
					
// 				}
				
// 			}
			
// 		}
		
// 		// Proof doesn't found, return Unknown
// 		//console.log( query.list([ ... path, query ]).toString() )
// 		return null
		
// 	}
	
// 	export function $jin_fulog_ask(
// 		universe: $mol_tree2,
// 		query: $mol_tree2,
// 	): $mol_tree2 {
		
// 		// Try to proof both hypotheses
// 		const positive = $jin_fulog_proof( universe, query.list([ query.struct( '+', query.kids ) ]) )
// 		const negative = $jin_fulog_proof( universe, query.list([ query.struct( '-', query.kids ) ]) )
		
// 		if( positive ) {
// 			if( negative ) { // Absurd
// 				return query.struct( '!', [
// 					positive.struct( '+', positive.kids ),
// 					positive.struct( '-', negative.kids ),
// 				] )
// 			} else { // True
// 				return query.struct( '+', positive.kids )
// 			}
// 		} else {
// 			if( negative ) { // False
// 				return query.struct( '-', negative.kids )
// 			} else { // Unknown
// 				return query.struct( '?' )
// 			}
// 		}
		
// 	}
	
}
