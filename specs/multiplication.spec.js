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

describe('Multiplication', () =>{
	const multiply = util.promisify(client.multiply.bind(client));

	describe('when multiplying two positive whole integers', () => {
		it('should return NaN if incorrect input is given', async () => {
			const response = await multiply({ operand1: 5, operand2: 'illegal value' });
			expect(response.value).to.be.NaN;
		});

		it('should multiply integers as expected', async () => {
			const response = await multiply({ operand1: 5, operand2: 1 });
			expect(response.value).to.be.greaterThan(4);
			expect(response.value).to.be.lessThan(6);
			expect(response.value).to.be.equal(5);
		});
	});

	describe('when multiplying a positive whole integer and a negative whole integer', () => {
		it('should return NaN if incorrect input is given', async () => {
			const response = await multiply({ operand1: 'illegal value', operand2: -6 });
			expect(response.value).to.be.NaN;
		});

		it('should multiply integers as expected', async () => {
			const response = await multiply({ operand1: 5, operand2: -6 });
            
			expect(response.value).to.be.greaterThan(-31);
			expect(response.value).to.be.lessThan(-29);
			expect(response.value).to.be.equal(-30);
		});
	});

	describe('when multiplying two negative whole integers', () => {
		it('should multiply integers as expected', async () => {
			const response = await multiply({ operand1: -5, operand2: -6 });
            
			expect(response.value).to.be.greaterThan(29);
			expect(response.value).to.be.lessThan(31);
			expect(response.value).to.be.equal(30);
		});
	});

	describe('when multiplying a postive whole integer and a positive fractional integer', () => {
		it('should return NaN if incorrect input is given', async () => {
			const response = await multiply({ operand1: 5.6, operand2: 'illegal value' });
			expect(response.value).to.be.NaN;
		});

		it('should multiply integers as expected', async () => {
			const response = await multiply({ operand1: 5, operand2: 1.7 });

			const result = Number((response.value).toFixed(1));
			expect(result).to.be.greaterThan(8.4);
			expect(result).to.be.lessThan(8.6);
			expect(result).to.be.equal(8.5);
		});
	});

	describe('when multiplying a postive whole integer and a negative fractional integer', () => {
		it('should return NaN if incorrect input is given', async () => {
			const response = await multiply({ operand1: -5.6, operand2: 'illegal value' });
			expect(response.value).to.be.NaN;
		});

		it('should multiply integers as expected', async () => {
			const response = await multiply({ operand1: 5, operand2: -1.7 });

			const result = Number((response.value).toFixed(1));
			expect(result).to.be.greaterThan(-8.6);
			expect(result).to.be.lessThan(-8.4);
			expect(result).to.be.equal(-8.5);
		});
	});

	describe('when multiplying a negative whole integer and a positive fractional integer', () => {

		it('should multiply integers as expected', async () => {
			const response = await multiply({ operand1: -5, operand2: 1.7 });

			const result = Number((response.value).toFixed(1));
			expect(result).to.be.greaterThan(-8.6);
			expect(result).to.be.lessThan(-8.4);
			expect(result).to.be.equal(-8.5);
		});
	});

	describe('when multiplying a negative whole integer and a negative fractional integer', () => {

		it('should multiply integers as expected', async () => {
			const response = await multiply({ operand1: -5, operand2: -1.7 });

			const result = Number((response.value).toFixed(1));
			expect(result).to.be.greaterThan(8.4);
			expect(result).to.be.lessThan(8.6);
			expect(result).to.be.equal(8.5);
		});
	});
});