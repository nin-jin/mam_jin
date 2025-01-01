namespace $ {
	
	function check( input: string, output: string ) {
		$mol_assert_equal(
			$$.$jin_fulog_solve(
				$$.$mol_tree2_from_string( input )
			).toString(),
			$$.$mol_tree2_from_string( output ).toString(),
		)
	}
	
	$mol_test({
		
		'exact match to existen positive fact'() {
			check(
				`
					is_male
					Socrat
					socrat_is_male
						+ is_male Socrat
					is_socrat_male
						? is_male Socrat
				`,
				`
					is_male
					Socrat
					socrat_is_male
						+ is_male Socrat
					is_socrat_male
						+ is_male Socrat
						$ socrat_is_male
				`,
			)
		},
		
		'exact match to existen negative fact'() {
			check(
				`
					is_female
					Socrat
					socrat_isnt_female
						- is_female Socrat
					is_socrat_female
						? is_female Socrat
				`,
				`
					is_female
					Socrat
					socrat_isnt_female
						- is_female Socrat
					is_socrat_female
						- is_female Socrat
						$ socrat_isnt_female
				`,
			)
		},
		
		'no relevant facts'() {
			check(
				`
					is_male
					Socrat
					Platon
					platon_is_male
						+ is_male Platon
					socrat_is_male
						? is_male Socrat
				`,
				`
					is_male
					Socrat
					Platon
					platon_is_male
						+ is_male Platon
					socrat_is_male
						? is_male Socrat
				`,
			)
		},
		
		'absurd facts'() {
			check(
				`
					is_male
					Socrat
					socrat_is_male
						+ is_male Socrat
					socrat_isnt_male
						- is_male Socrat
				`,
				`
					is_male
					Socrat
					socrat_is_male
						+ is_male Socrat
					socrat_isnt_male
						! - is_male Socrat
						$ socrat_is_male
				`,
			)
		},
		
		'generic fact'() {
			check(
				`
					some_pair
						+ pair @left @right
					socrat_and_platon
						? pair Socrat Platon
				`,
				`
					some_pair
						+ pair @left @right
					socrat_and_platon
						+ pair Socrat Platon
						$ some_pair
							@left Socrat Platon
							@right Platon
				`,
			)
		},
		
		// 'generic question'() {
		// 	check(
		// 		`
		// 			socrat_is_human
		// 				+ Socrat is_item_of Humanity
		// 			some-item
		// 				? @item is_item_of @set
		// 		`,
		// 		`
		// 			socrat_is_human
		// 				+ Socrat is_item_of Humanity
		// 			some-item
		// 				+ Socrat is_item_of Humanity
		// 				$ socrat_is_human
		// 					Socrat @item
		// 					Human @set
		// 		`,
		// 	)
		// },
		
		'dependent facts / modus ponens'() {
			check(
				`
					socrat_is_man
						+ Socrat is Man
					man_is_human
						+ @man is Human
						/ + @man is Man
					socrat_is_human
						? Socrat is Human
				`,
				`
					socrat_is_man
						+ Socrat is Man
					man_is_human
						+ @man is Human
						/ + @man is Man
					socrat_is_human
						+ Socrat is Human
						$ man_is_human
							@man Socrat is Human
							$ socrat_is_man
				`,
			)
		},
		
		'dependent facts / modus tolens'() {
			check(
				`
					dracula_isnt_human
						- Dracula is Human
					man_is_human
						+ @man is Human
						/ + @man is Man
					modus_tolens
						- @cause
						/
							+ @cons
							/ + @cause
						/ - @cons
					is_dracula_man
						? Dracula is Man
				`,
				`
					dracula_isnt_human
						- Dracula is Human
					man_is_human
						+ @man is Human
						/ + @man is Man
					is_dracula_man
						- Dracula is Man
						$ man_is_human
							@man Dracula
							$ dracula_isnt_human
				`,
			)
		},
		
		// 'dependent facts / modus tollens'( $ ) {
			 
		// 	const universe = $.$mol_tree2_from_string( `
		// 		+
		// 			isMortal @person
		// 			+ isHuman @person
		// 		- isMortal Dracula
		// 		-
		// 			@cause @c
		// 			+
		// 				@cons @c
		// 				+ @cause @c
		// 			- @cons @c
		// 	`, 'universe' )
			
		// 	const question = $.$mol_tree2_from_string( `
		// 		isHuman Dracula
		// 	`, 'question' )
			
		// 	const answer = $.$mol_tree2_from_string( `
		// 		-
		// 			universe#2:5/1 *
		// 				@human \\Socrat
		// 			universe#9:5/1 *
		// 	`, 'answer' )
			
		// 	$mol_assert_equal(
		// 		new $.$jin_fulog().fill( universe ).ask( question ).toString(),
		// 		answer.toString(),
		// 	)
			
		// },
		
		// 'Axion: item of subset is item of superset too'( $ ) {
			
		// 	const universe = $.$mol_tree2_from_string( `
		// 		+ item/set
		// 			Socrat
		// 			Man
		// 		+ sub/super
		// 			Man
		// 			Human
		// 		+
		// 			item/set
		// 				@item
		// 				@super
		// 			+ item/set
		// 				@item
		// 				@sub
		// 			+ sub/super
		// 				@sub
		// 				@super
		// 	`, 'universe' )
			
		// 	const question = $.$mol_tree2_from_string( `
		// 		item/set
		// 			Socrat
		// 			Human
		// 	`, 'question' )
			
		// 	const answer = $.$mol_tree2_from_string( `
		// 		+
		// 			universe#8:5/1 *
		// 				@item \\Socrat
		// 				@super \\Human
		// 			universe#2:5/1 * @sub \\Man
		// 			universe#5:5/1 *
		// 	`, 'answer' )
			
		// 	$mol_assert_equal(
		// 		new $.$jin_fulog().fill( universe ).ask( question ).toString(),
		// 		answer.toString(),
		// 	)
			
		// },
		
		// 'Meta Axion: property transition on relation'( $ ) {
			
		// 	const universe = $.$mol_tree2_from_string( `
		// 		+ isMortal Animal
		// 		+ sub/super
		// 			Human
		// 			Animal
		// 		+ property-transit-relation
		// 			isMortal
		// 			sub/super
		// 		+
		// 			@property @target
		// 			+ @property @source
		// 			+ @relation
		// 				@target
		// 				@source
		// 			+ property-transit-relation
		// 				@property
		// 				@relation
		// 	`, 'universe' )
			
		// 	const question = $.$mol_tree2_from_string( `
		// 		isMortal Human
		// 	`, 'question' )
			
		// 	const answer = $.$mol_tree2_from_string( `
		// 		+
		// 			universe#9:5/1 *
		// 				@property \\isMortal
		// 				@target \\Human
		// 			universe#2:5/1 *
		// 				@source \\Animal
		// 			universe#3:5/1 *
		// 				@relation \\sub/super
		// 			universe#6:5/1 *
		// 	`, 'answer' )
			
		// 	$mol_assert_equal(
		// 		new $.$jin_fulog().fill( universe ).ask( question ).toString(),
		// 		answer.toString(),
		// 	)
			
		// },
		
	})
}
