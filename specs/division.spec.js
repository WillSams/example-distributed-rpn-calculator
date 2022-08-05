process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = chai.expect;

const grpc = require('@grpc/grpc-js');
const loader = require('@grpc/proto-loader');

const util = require('util');

const pkg_def = loader.loadSync(`${__dirname}/../src/shared/grpc-calculator.proto`);
const calculator = grpc.loadPackageDefinition(pkg_def).calculator;

const target = `${process.env.PRODUCER_HOST}:${process.env.PRODUCER_PORT}`;

const client = new calculator.CalculatorService(
	target,
	grpc.credentials.createInsecure()
);

describe('Division', () =>{
	const divide = util.promisify(client.divide.bind(client));

	describe('when dividing two positive whole integers', () => {
		it('should return NaN if incorrect input is given', async () => {
			const response = await divide({ operand1: 5, operand2: 'illegal value' });
			expect(response.value).to.be.NaN;
		});

		it('should divide integers as expected', async () => {
			const response = await divide({ operand1: 5, operand2: 1 });
			expect(response.value).to.be.greaterThan(4);
			expect(response.value).to.be.lessThan(7);
			expect(response.value).to.be.equal(5);
		});
	});

	describe('when dividing a positive whole integer and a negative whole integer', () => {
		it('should return NaN if incorrect input is given', async () => {
			const response = await divide({ operand1: 'illegal value', operand2: -6 });
			expect(response.value).to.be.NaN;
		});

		it('should divide integers as expected', async () => {
			const response = await divide({ operand1: 5, operand2: -6 });
            const result = Number((response.value).toFixed(1));
			expect(result).to.be.greaterThan(-1);
			expect(result).to.be.lessThan(0);
			expect(result).to.be.equal(-0.8);
		});
	});

	describe('when dividing two negative whole integers', () => {
		it('should divide integers as expected', async () => {
			const response = await divide({ operand1: -5, operand2: -6 });
            const result = Number((response.value).toFixed(1));
			expect(result).to.be.greaterThan(0);
			expect(result).to.be.lessThan(1);
			expect(result).to.be.equal(0.8);
		});
	});

	describe('when dividing a postive whole integer and a positive fractional integer', () => {
		it('should return NaN if incorrect input is given', async () => {
			const response = await divide({ operand1: 5.6, operand2: 'illegal value' });
			expect(response.value).to.be.NaN;
		});

		it('should divide integers as expected', async () => {
			const response = await divide({ operand1: 5, operand2: 1.7 });

			const result = Number((response.value).toFixed(1));
			expect(result).to.be.greaterThan(2.8);
			expect(result).to.be.lessThan(3);
			expect(result).to.be.equal(2.9);
		});
	});

	describe('when dividing a postive whole integer and a negative fractional integer', () => {
		it('should return NaN if incorrect input is given', async () => {
			const response = await divide({ operand1: -5.6, operand2: 'illegal value' });
			expect(response.value).to.be.NaN;
		});

		it('should divide integers as expected', async () => {
			const response = await divide({ operand1: 5, operand2: -1.7 });

			const result = Number((response.value).toFixed(1));
			expect(result).to.be.greaterThan(-3);
			expect(result).to.be.lessThan(-2.8);
			expect(result).to.be.equal(-2.9);
		});
	});

	describe('when dividing a negative whole integer and a positive fractional integer', () => {

		it('should divide integers as expected', async () => {
			const response = await divide({ operand1: -5, operand2: 1.7 });

			const result = Number((response.value).toFixed(1));
			expect(result).to.be.greaterThan(-3);
			expect(result).to.be.lessThan(-2.8);
			expect(result).to.be.equal(-2.9);
		});
	});

	describe('when dividing a negative whole integer and a negative fractional integer', () => {

		it('should divide integers as expected', async () => {
			const response = await divide({ operand1: -5, operand2: -1.7 });

			const result = Number((response.value).toFixed(1));
			expect(result).to.be.greaterThan(2.8);
			expect(result).to.be.lessThan(3);
			expect(result).to.be.equal(2.9);
		});
	});
});