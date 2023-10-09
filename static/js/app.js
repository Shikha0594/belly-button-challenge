d3.json('./samples.json').then(importedData => {
	console.log(importedData);

	var data = importedData;
	var names = data.names;

	names.forEach(name => {
		d3.select('#selDataset').append('option').text(name);
	});
	function init() {
		defaultDataset = data.samples.filter(sample => sample.id === '940')[0];
		console.log(defaultDataset);

		allSampleValuesDefault = defaultDataset.sample_values;
		allOtuIdsDefault = defaultDataset.otu_ids;
		allOtuLabelsDefault = defaultDataset.otu_labels;

		sampleValuesDefault = allSampleValuesDefault.slice(0, 10).reverse();
		otuIdsDefault = allOtuIdsDefault.slice(0, 10).reverse();
		otuLabelsDefault = allOtuLabelsDefault.slice(0, 10).reverse();

		console.log(sampleValuesDefault);
		console.log(otuIdsDefault);
		console.log(otuLabelsDefault);

		var trace1 = {
			x: sampleValuesDefault,
			y: otuIdsDefault.map(outId => `OTU ${outId}`),
			text: otuLabelsDefault,
			type: 'bar',
			orientation: 'h',
		};

		var barData = [trace1];

		var barlayout = {
			xaxis: { title: 'Sample Value' },
			yaxis: { title: 'OTU ID' },
			autosize: false,
			width: 450,
			height: 600,
		};

		Plotly.newPlot('bar', barData, barlayout);

		var trace2 = {
			x: allOtuIdsDefault,
			y: allSampleValuesDefault,
			text: allOtuLabelsDefault,
			mode: 'markers',
			marker: {
				color: allOtuIdsDefault,
				size: allSampleValuesDefault,
			},
		};

		var bubbleData = [trace2];

		var bubbleLayout = {
			xaxis: { title: 'OTU ID' },
			yaxis: { title: 'Sample Value' },
			showlegend: false,
		};

		Plotly.newPlot('bubble', bubbleData, bubbleLayout);

		demoDefault = data.metadata.filter(sample => sample.id === 940)[0];
		console.log(demoDefault);

		Object.entries(demoDefault).forEach(([key, value]) =>
			d3
				.select('#sample-metadata')
				.append('p')
				.text(`${key.toUpperCase()}: ${value}`)
		);

		var wfreqDefault = demoDefault.wfreq;
		var gaugeData = [
			{
				domain: { x: [0, 1], y: [0, 1] },
				value: wfreqDefault,
				title: {
					text: '<b>Belly Button Washing Frequency</b> <br> Scrubs per week',
				},
				type: 'indicator',
				mode: 'gauge+delta+number',
				gauge: {
					axis: { range: [null, 9] },
					steps: [
						{ range: [0, 1], color: 'rgb(248, 243, 236)' },
						{ range: [1, 2], color: 'rgb(244, 241, 229)' },
						{ range: [2, 3], color: 'rgb(233, 230, 202)' },
						{ range: [3, 4], color: 'rgb(229, 231, 179)' },
						{ range: [4, 5], color: 'rgb(213, 228, 157)' },
						{ range: [5, 6], color: 'rgb(183, 204, 146)' },
						{ range: [6, 7], color: 'rgb(140, 191, 136)' },
						{ range: [7, 8], color: 'rgb(138, 187, 143)' },
						{ range: [8, 9], color: 'rgb(133, 180, 138)' },
					],
				},
			},
		];

		var gaugeLayout = { width: 600, height: 450, margin: { t: 0, b: 0 } };

		Plotly.newPlot('gauge', gaugeData, gaugeLayout);
	}

	init();

	// Call updateBar() when a change takes place to the DOM
	d3.selectAll('#selDataset').on('change', updatePlot);

	function updatePlot() {
		var inputElement = d3.select('#selDataset');

		var inputValue = inputElement.property('value');
		console.log(inputValue);

		dataset = data.samples.filter(sample => sample.id === inputValue)[0];
		console.log(dataset);

		allSampleValues = dataset.sample_values;
		allOtuIds = dataset.otu_ids;
		allOtuLabels = dataset.otu_labels;

		top10Values = allSampleValues.slice(0, 10).reverse();
		top10Ids = allOtuIds.slice(0, 10).reverse();
		top10Labels = allOtuLabels.slice(0, 10).reverse();

		Plotly.restyle('bar', 'x', [top10Values]);
		Plotly.restyle('bar', 'y', [top10Ids.map(outId => `OTU ${outId}`)]);
		Plotly.restyle('bar', 'text', [top10Labels]);

		Plotly.restyle('bubble', 'x', [allOtuIds]);
		Plotly.restyle('bubble', 'y', [allSampleValues]);
		Plotly.restyle('bubble', 'text', [allOtuLabels]);
		Plotly.restyle('bubble', 'marker.color', [allOtuIds]);
		Plotly.restyle('bubble', 'marker.size', [allSampleValues]);

		metainfo = data.metadata.filter(sample => sample.id == inputValue)[0];

		d3.select('#sample-metadata').html('');

		Object.entries(metainfo).forEach(([key, value]) =>
			d3.select('#sample-metadata').append('p').text(`${key}: ${value}`)
		);

		var wfreq = metainfo.wfreq;

		Plotly.restyle('gauge', 'value', wfreq);
	}
});
