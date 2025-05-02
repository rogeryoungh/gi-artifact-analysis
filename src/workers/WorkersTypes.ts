export interface WorkerRequest<Params> {
	id: number;
	method: string;
	params: Params;
}

export interface WorkerResponse<Result> {
	id: number;
	result?: Result;
	error?: string;
}
