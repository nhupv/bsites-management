import FakeBackendService from "@/app/http/services/fakeBackendService";
import AuthService from "@/app/http/services/AuthService";
import HttpService from "@/app/http/httpService";

const fakeBackendService = new FakeBackendService();

const authService = new AuthService()

const httpService = new HttpService()

export { fakeBackendService, authService, httpService };
