namespace $ {
	
	function match( left: string, right: string ) {
		return $$.$jin_fulog_match(
			$$.$mol_tree2_from_string( left ),
			$$.$mol_tree2_from_string( right ),
		)?.map(
			subs => subs && [ ... subs ].map(
				pair => pair.map( String )
			)
		) ?? null
	}
	
	$mol_test({
		
		'different dont match'() {
			
			$mol_assert_equal(
				match(
					`foo bar lol\n`, 
					`foo lol bar\n`
				),
				null,
			)
			
		},
		
		'same match'() {
			
			$mol_assert_equal(
				match(
					`foo bar\n`, 
					`foo bar\n`
				),
				[ [], [] ],
			)
			
		},
		
		'fill concrete'() {
			
			$mol_assert_equal(
				match(
					`
						foo
							@az bar @buki
							@vedi
					`,
					`
						foo
							lol bar 777
							kek
					`,
				),
				[
					[
						[ '@az', 'lol bar 777\n' ],
						[ '@buki', '777\n' ],
						[ '@vedi', 'kek\n' ],
					],
					[],
				],
			)
			
		},
		
		'fill subtree'() {
			
			$mol_assert_equal(
				match(
					`
						foo
							@bar
							lol
					`,
					`
						foo
							kek 777
							lol
					`,
				),
				[
					[
						[ '@bar', 'kek 777\n' ],
					],
					[],
				],
			)
			
		},
		
		// 'fill abstract'() {
			
		// 	$mol_assert_equal(
		// 		match(
		// 			`
		// 				foo
		// 					lol bar 777
		// 					kek
		// 			`,
		// 			`
		// 				foo
		// 					@az bar @buki
		// 					@vedi
		// 			`,
		// 		),
		// 		[
		// 			[],
		// 			[
		// 				[ '@az', 'lol\n' ],
		// 				[ '@buki', '777\n' ],
		// 				[ '@vedi', 'kek\n' ],
		// 			],
		// 		],
		// 	)
			
		// },
		
		'rename placeholders'() {
			
			$mol_assert_equal(
				match(
					`foo @bar\n`,
					`foo @lol\n`,
				),
				[
					[
						[ '@bar', '@lol\n' ],
					],
					[
						// [ '@lol', '@bar\n' ],
					],
				],
			)
			
		},
		
		// 'fill both'() {
			
		// 	$mol_assert_equal(
		// 		match(
		// 			`foo @bar @666\n`,
		// 			`@lol kek @777\n`,
		// 		),
		// 		[
		// 			[
		// 				[ '@bar', 'kek\n' ],
		// 				[ '@666', '@777\n' ],
		// 			],
		// 			[
		// 				[ '@lol', 'foo\n' ],
		// 				[ '@777', '@666\n' ],
		// 			],
		// 		],
		// 	)
			
		// },
		
	})

}
