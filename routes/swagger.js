'use strict';

module.exports = {
    swaggerDefinition: {
        // 정보
        info: {
            title: 'node js test app',
            version: '1.0.0',
            description: 'Make For node js test.'
        },
        // 주소
        host: "localhost:3000",
        // 기본 root path
        basePath: "/",
        contact: {
            email: "wltjr0920@ajou.ac.kr"
        },
        // 각 api에서 설명을 기록할 때 사용할 constant들을 미리 등록해놓는것
        components: {
            res: {
                BadRequest: {
                    description: '잘못된 요청.',
                    schema: {
                        $ref: '#/components/errorResult/Error'
                    }
                },
                Forbidden: {
                    description: '권한이 없슴.',
                    schema: {
                        $ref: '#/components/errorResult/Error'
                    }
                },
                NotFound: {
                    description: '없는 리소스 요청.',
                    schema: {
                        $ref: '#/components/errorResult/Error'
                    }
                }
            },
            errorResult: {
                Error: {
                    type: 'object',
                    properties: {
                        errMsg: {
                            type: 'string',
                            description: '에러 메시지 전달.'
                        }
                    }
                }
            }
        },
        schemes: ["http", "https"], // 가능한 통신 방식
        definitions:  // 모델 정의 (User 모델에서 사용되는 속성 정의)
            {
                'user': {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string'
                        },
                        age: {
                            type: 'integer'
                        },
                        addr: {
                            type: 'string'
                        }
                    }
                },
                'category': {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer'
                        },
                        name: {
                            type: 'string'
                        },
                        description: {
                            type: 'string'
                        }
                    }
                }
            }
    },
    apis: ['./routes/*.js'] // api 파일 위치들
};
