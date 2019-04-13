# Intro

Spring의 핵심 기술에 대한 요약을 정리한다.  
단순히 사용만 해왔던 개념에 대해 이해해보고 설명할 수 있는 지식을 얻는 것이 목표임

# 색인

- [Intro](#intro)
- [색인](#%EC%83%89%EC%9D%B8)
- [1. Inversion of Control](#1-inversion-of-control)
  - [1.1 ApplicationContext](#11-applicationcontext)
  - [1.2 의존성 주입](#12-%EC%9D%98%EC%A1%B4%EC%84%B1-%EC%A3%BC%EC%9E%85)
  - [1.3 Component, ComponentScan](#13-component-componentscan)
  - [1.4 Scope](#14-scope)
  - [1.5 Profile - Envirionment](#15-profile---envirionment)
  - [1.6 Properties - Envirionment](#16-properties---envirionment)
  - [1.7 MessageSource](#17-messagesource)
  - [1.8 ApplicationEventPublisher](#18-applicationeventpublisher)
  - [1.9 ResourceLoader](#19-resourceloader)
  - [1.10 요약](#110-%EC%9A%94%EC%95%BD)
- [2. 추상화](#2-%EC%B6%94%EC%83%81%ED%99%94)
  - [2.1 Resource](#21-resource)
  - [2.2 Validation](#22-validation)
  - [2.3 Data binding](#23-data-binding)
    - [2.3.1 PropertyEditor](#231-propertyeditor)
    - [2.3.2 Converter & Formatter](#232-converter--formatter)
    - [2.3.3 Converter Service](#233-converter-service)
- [3. SpEL (Spring Expression Language)](#3-spel-spring-expression-language)
- [4. AOP(Aspect Oriented Programming)](#4-aopaspect-oriented-programming)

# 1. Inversion of Control

(1) Spring IoC Container
   - [BeanFactory](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/beans/factory/BeanFactory.html) (최상위 인터페이스)
   - 애플리케이션 컴포넌트 중앙 저장소
   - Bean 설정 소스로부터 Bean 정의를 읽고 구성하고 제공함
     - Bean이 되는 클래스는 객체 생성을 위한 템플릿임

(2) Bean: IoC 컨테이너가 관리하는 객체 (Java Bean이 아님)  
   * 왜 Bean을 쓰는가?
     - 의존성 주입(DI)을 받기 위해서 (의존성 관리)
     - Bean의 Scope 관리
     - IoC 컨테이너에 등록되는 빈은 기본전으로 Singleton scope
     - Scope의 종류
       - Singleton: 유일한 객체
       - Prototype: 매번 생성
     - [라이프사이클 인터페이스](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/Lifecycle.html)
     - 테스트 용이
       - 의존성을 언제든 바꾸어 주입이 가능하니까(mock 주입)

(3) ApplicationContext  

[코드 원형](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/ApplicationContext.html)은 다음와 같다.

```java
public interface ApplicationContext extends EnvironmentCapable, ListableBeanFactory, HierarchicalBeanFactory,
		MessageSource, ApplicationEventPublisher, ResourcePatternResolver {
      @Nullable
      String getId();
      
      String getApplicationName();
      
      String getDisplayName();
      
      long getStartupDate();
      
      @Nullable
      ApplicationContext getParent();
      
      AutowireCapableBeanFactory getAutowireCapableBeanFactory() throws IllegalStateException;
}
```

- BeanFactory 상속
- 환경 관리 (애플리케이션이 동작하는 환경)
- 다국어 관리
- 리소스 관리
- 애플리케이션 이벤트 관리

## 1.1 ApplicationContext

![ioc-container](asset/ioc-container.png)

(1) 스프링 IoC 컨테이너의 역할:
* 의존관계 메타 정보 생성
* Bean Instance(비즈니스 로직) 생성
* Bean 제공

(2) ApplicationContext 설정을 위한 구현체:
* ClassPathXmlApplicationContext(xml file)
* AnnotationConfigApplicationContext(Java)

(3) Bean 설정:
* Bean template(class)
* Bean의 정의
  * ID
  * scope
  * name
  * class
  * constructor
  * setter

(4) 컴포넌트 스캔: IoC 컨테이너에 등록될 Bean을 능동적으로 찾음
* 설정 방법
  * XML: context:component-scan
  * Java: @ComponentScan
    * BasePackages: type safe하지 않음
    * BasePackageClasses: type safe함
* 스캔 대상
  * @Component가 걸린 모든 클래스 (상속된 스테레오 타입 어노테이션 포함)

## 1.2 의존성 주입

(1) 스프링 IoC 컨테이너가 관리하는 bean을 주입 받을 수 있다.
* Bean의 라이프싸이클을 관리할 필요가 없음
* 생성을 직접 할 필요도 없음

(2) 어떻게?
* @Autowired 어노테이션을 사용해서

(3) 대상
* 생성자 (4.3 이후로 생략)
* 필드
* 세터

(4) Bean이 여러개인 경우는 어떻게?
* @Primary 어노테이션
* @Qualifier (빈 이름으로 주입, type-safe x)
* List나 빈의 이름과 일치하는 식별자 사용

(5) 참고
* [BeanPostProcessor](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/beans/factory/config/BeanPostProcessor.html)
* [AutowiredAnnotationBeanPostProcessor](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/beans/factory/annotation/AutowiredAnnotationBeanPostProcessor.html)

## 1.3 Component, ComponentScan

(1) Component Scan

* @Component가 붙어 있는 대상을 찾음
* 스캔할 대상 위치 설정
* 스캔에서 제외할 대상 설정   
  예제
  ```java
  @ComponentScan(excludeFilters = {
		@Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
		@Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
  ```

(2) Bean과 Component의 차이

결론적으로 @Component로 지정된 클래스가 빈으로 등록된다고 보면 된다.  
둘의 차이점을 비교해보자.

||@Bean|@Component|
|-|-|-|
|대상|메소드, 어노테이션|클래스|
|목적|외부 라이브러리|개발자가 작성한 코드|
|예제|amqp, jackson|비즈니스 로직, 설정 등|

(3) Component의 종류

* @Service
* @Repository
* @Controller
* @RestController
* @Configuration

(4) ComponentScan 사용 방법

* @ComponentScan
  * BasePackages
  * BasePackageClasses
* XML
  * context:component-scan
* Function
  ```java
  var app = new SpringApplication(MyApplication.class);
  app.addInitializers((ApplicationContextInitializer<GenericApplicationContext>) ctx -> {
            ctx.registerBean(MyClass.class);
  });
  app.run(args);
  ```

## 1.4 Scope

Note: 기본 스코프는 `singleton`이다. 

(1) Scope의 종류

* singleton
* prototype
  * request
  * session
  * ...

(2) prototype 스코프의 빈이 singleton 참조
* 아무런 문제가 없다

(3) singleton 스코프의 빈이 prototype 참조
* 문제가 있다
  * 업데이트가 안된다. (원래 의도를 상실)
* 해결
  * scoped-proxy
  * Object Provider
  * Provider (표준)

(4) 실습

Prototype scoped class
```java
@Scope("prototype")
@Component
public class Proto {
}
```

Singleton scoped class
```java
@Component
public class Single {

    @Autowired
    private Proto proto;

    public Proto getProto() {
        return proto;
    }
}
```

main
```java
@SpringBootApplication
public class MyApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }

    @Autowired
    private ApplicationContext ctx;

    @Bean
    public CommandLineRunner test() {
        return args -> {
            System.out.println("Singleton");
            System.out.println(ctx.getBean("single"));
            System.out.println(ctx.getBean("single"));
            System.out.println(ctx.getBean("single"));
            System.out.println("Prototype");
            System.out.println(ctx.getBean("proto"));
            System.out.println(ctx.getBean("proto"));
            System.out.println(ctx.getBean("proto"));
            System.out.println("Prototype in Singleton");
            System.out.println(((Single)ctx.getBean("single")).getProto());
            System.out.println(((Single)ctx.getBean("single")).getProto());
            System.out.println(((Single)ctx.getBean("single")).getProto());
        };
    }
}
```

해결 방법 -> Proxy

(a) Provider 사용

```java
@Component
public class Single {

    @Autowired
    private ObjectProvider<Proto> proto;

    public Proto getProto() {
        return proto.getIfAvailable();
    }
}
```

단점: 비즈니스 로직 내에 스프링 코드가 들어간다.

(b) Scope 어노테이션

```java
@Scope(value = "prototype", proxyMode = ScopedProxyMode.TARGET_CLASS)
@Component
public class Proto {
}
```

(c) 어떻게 이게 가능해?

* 대상이 되는 클래스를 상속 받은 Proxy 클래스를 만들어서 주입하기 때문에 가능.

(5) 추가 학습
* Proxy Pattern
* cglib

(6) 싱글톤 스코프 사용 시 주의할 점
* Non thread-safe
* ApplicationContext 구동 시 설정
  * 구동 시간이 증가

## 1.5 Profile - Envirionment

Environment 기능에 대해 정리한다.  
`Environment`는 `profile`과 `property`를 다루는 인터페이스이다.  

(1) ApplicationContext를 보자

ApplicationContext 인터페이스에 이런게 있다.  

```java
public interface EnvironmentCapable {

	/**
	 * Return the {@link Environment} associated with this component.
	 */
	Environment getEnvironment();

}
```

(2) Profile이란?
* Bean들의 그룹 (환경에 따라 사용하는 빈이 달라질 수 있음)
* `Environment`: 활성화 할/된 프로파일 설정 및 확인 가능

```java
@Autowired
private ApplicationContext ctx;

@Bean
public CommandLineRunner test() {
    return args -> {
        Environment environment = ctx.getEnvironment();
        System.out.println(Arrays.toString(environment.getActiveProfiles()));
        System.out.println(Arrays.toString(environment.getDefaultProfiles()));
    };
}
```

(3) 어디에 써요?

* 환경 별로 사용할 빈을 나눌 때
  * ex) local, dev, prod
* 제외 시킬 때
  * 테스트에는 필요 없지만 프로덕션에선 필요해 ㅇㅅㅇ!

(4) @Profile

* Retention: Runtime
* Target: method, class
* `!`, `&`, `|` 등의 연산자 사용 가능

(5) 실행 시 프로파일 설정

```java
java -jar app.jar -Dspring.profiles.active="A,B,C"
```

## 1.6 Properties - Envirionment

(1) 프로퍼티
* key-value 형태로 정의 할 수 있는 설정 값
* Environment가 이 프로퍼티 소스와 값을 가져옴

(2) 파일 종류
* properties
* yaml

(3) 사용 방법

* 기본적으로 application.properties(혹은 application.yaml)
  * application-{profile}.ext 형태
  * profile마다 읽어오는 파일도 달라짐
* 어노테이션 사용 - 파일 지정
  ```java
  @PropertySource("classpath:/app.properties")
  ```
* 코드에서 사용
  ```java
  environment.getProperty("app.config.blah");
  ```

## 1.7 MessageSource

i18n을 위한 기능. SPA + Rest API로 가면 필요할까? 알아두면 언젠간 쓰겠지 ㅇㅅㅇ  

```java
package org.springframework.context;

import java.util.Locale;

import org.springframework.lang.Nullable;

public interface MessageSource {

	@Nullable
	String getMessage(String code, @Nullable Object[] args, @Nullable String defaultMessage, Locale locale);

	String getMessage(String code, @Nullable Object[] args, Locale locale) throws NoSuchMessageException;

	String getMessage(MessageSourceResolvable resolvable, Locale locale) throws NoSuchMessageException;

}
```

이것도 ApplicationContext를 보면 있다. (context에서 꺼낼 수 있다는 뜻)
MessageSource를 @Autowired로 꺼내서 쓸 수도 있고, 세부 설정도 가능하다.  

(1) 프로퍼티 파일 이름

다음과 같은 형식을 따른다.  

```text
messages.properties
messages_{local_name}.properties
```
한국어 로케일은 다음과 같이 생성해주면 된다.  

```text
messages_ko_KR.properties
```

이 역시 key-value로 작성하면 된다.  

```text
greeting=Hello {0}, {1}
greeting=안녕하세요 {0}, {2}
```

당연히 key가 되는 부분은 같아야 한다.  

(2) 사용

```java
messageSource.getMessage("greeting", new String[]{"Guest", "It's hogu"}, Locale.getDefault()
messageSource.getMessage("greeting", new String[]{"고객님", "호구입니다"}, Locale.KOREA);
```

(3) 여러 기타 설정

@Bean으로 세부 설정을 하는 메소드를 만들면 된다.  

```java
@Bean("customMessageSource")
public MessageSource messageSource() {
    var messageSource = new ReloadableResourceBundleMessageSource();
    messageSource.setBasename("classpath:/messages");
    messageSource.setDefaultEncoding("utf-8");
    messageSource.setCacheSeconds(3);
    return messageSource;
}
```

* 빌드 시 message 설정 리로드
* basename 지정 가능
* 인코딩 지정 가능
* 캐시 유지 시간 설정 가능

## 1.8 ApplicationEventPublisher

Event programming을 위한 observer pattern 구현체.  
[ApplicationEventPublisher 참조](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/ApplicationEventPublisher.html)


(1) 4.2 이전에서의 사용 방법

* ApplicationEvent 상속
* ApplicationListener<T> 구현

실습해보자! 우선 이벤트를 만든다.  

```java
public class CustomEvent extends ApplicationEvent {

    private String message;

    /**
     * Create a new ApplicationEvent.
     *
     * @param source the object on which the event initially occurred (never {@code null})
     */
    public CustomEvent(Object source) {
        super(source);
    }

    public CustomEvent(Object source, String message) {
        super(source);
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
```

리스너를 만들자!

```java
@Component
public class CustomEventListener implements ApplicationListener<CustomEvent> {

    @Override
    public void onApplicationEvent(CustomEvent event) {
        System.out.println("Message from god: " + event.getMessage());
    }
}
```

이벤트를 발생시키자!

```java
@SpringBootApplication
public class AutowireApplication {

    public static void main(String[] args) {
        SpringApplication.run(AutowireApplication.class, args);
    }

    @Autowired
    private ApplicationEventPublisher publisher;

    @Bean
    public CommandLineRunner run() {
        return args -> {
            int i = 0;
            while (true) {
                publisher.publishEvent(new CustomEvent(this, "hiyo" + i++));
                Thread.sleep(1000L);
            }
        };
    }
}
```

단점이 무엇인지 고민해보자!

* 스프링 코드 침투
* POJO (non-invasive, transparent 파괴됨)

(2) 4.2 이후의 사용법

이벤트!

```java
public class CustomEvent {

    private String message;

    public CustomEvent(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
```

리스너!

```java
@Component
public class CustomEventListener  {

    @EventListener
    public void handle(CustomEvent customEvent) {
        System.out.println("Message from god: " + customEvent.getMessage());
    }
}
```

와우 ㅇㅅㅇ POJO가 되었어요!  

(3) 이벤트 리스너의 성질

* 기본적으로는 synchronized
* 순서는 @Order로 정함
  ```java
  @Order(Ordered.HIGHEST_PRECEDENCE)
  ```
* @Async로 비동기적 실행도 가능

(4) 이벤트의 종류

|Spring event|설명|
|-|-|
|ContextRefreshEvent|`ApplicationContext`가 초기화되거나 갱신|
|ContextStartedEvent|`ApplicationContext`가 `start()`를 실행하여 라이프사이클 bean들이 시작 신호를 받았다. |
|ContextStoppedEvent|`ApplicationContext`가 `stop()`를 하여 정지 신호를 받았다.|
|ContextClosedEvent|`ApplicationContext`가 `close()`를 하여 싱글톤 빈들이 소멸되었다.|

## 1.9 ResourceLoader

보통은 File API로 리소스를 읽는 것을 떠올리겠지만 ResourceLoader라는 것을 제공한다.  
[ResourceLoader 참고](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/core/io/ResourceLoader.html)

당연한 이야기지만 ApplicationContext도 이걸 상속 받는다.  

(1) 사용

resources 아래에 아무 파일이나 만든다.  
그리고 간단히 @Autowired를 걸어 주입받아 사용한다.  

```java
@Autowired
private ResourceLoader resourceLoader;

@Bean
public CommandLineRunner run() {
    return args -> {
        Resource resource = resourceLoader.getResource("classpath:file.txt");
        System.out.println(resource.exists());
        System.out.println(resource.getDescription());
        System.out.println(Files.readString(Path.of(resource.getURI())));;
    };
}
```

(2) 용례

* 클래스 패스에서 리소스 읽기
* 파일 시스템에서 리소스 읽기
* URL, URI
* 경로 읽기(상대/절대)


## 1.10 요약

* ApplicationContext는 `BeanFactory` 뿐만 아니라 여러 다양한 기능을 가지고 있는 IoC Container임

# 2. 추상화

스프링이 제공하는 여러 추상화에 대해 학습한다.  

* Resource
* Validation
* Data binding

스프링은 리소스를 추상화해서 사용하고 있다.  

* ClassPathXmlApplicationContext
* FileSystemXmlApplicationContext

리소스 구현체는 아주 많다.  

* UrlResource
* ClassPathResource
* FileSystemResource
* ServletContextResource

## 2.1 Resource

(1) ApplicationContext 구현체 확인

```java
applicationContext.getClass();
```

구현체의 클래스가 보인다. 보통 WebMVC에 어노테이션 달아서 사용하면:

```text
class org.springframework.boot.web.servlet.context.AnnotationConfigServletWebServerApplicationContext
```

ResourceLoader는:

* `location 문자열`
* `ApplicationContext` 타입

에 따라 나뉜다.  

```java
코드:
Resource resource = resourceLoader.getResource("classpath:secret.txt");
출력:
class org.springframework.core.io.ClassPathResource

코드:
Resource resource = resourceLoader.getResource("file:///뭔가엄청난경로/test.txt");
출력:
class org.springframework.core.io.FileUrlResource
```

## 2.2 Validation

객체 검증에 사용되는 인터페이스.  
주로 `WebMVC`에서 사용한다. 하지만 웹을 위해 국한된 것이 아니고 범용적인 목적으로 설계됨.

* JSR-303, JSR-349 지원

[Validator 참고](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/validation/Validator.html)

(1) 사용 방법

고전적인 방법: Validator 상속받은 클래스 사용

```java
public class MyValidator implements Validator {

    @Override
    public boolean supports(Class<?> clazz) {
        return TargetClass.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        ValidationUtils.rejectIfEmptyOrWhitespace(
                errors,
                "filedName",
                "notempty",
                "필드가 비어있으면 안됩니다."
        );
    }
}
```

up to boot 2.0.5: 어노테이션 사용

* @NotEmpty: 빈 문자열이나 null 허용 안함
* @NotNull: null 허용 안함
* @Email: 이메일 형식의 문자열만 허용
* @Size: 리스트의 크기 검사
* @Min: 정수 값의 최소 크기
* @Max: 정수 값의 최대 크기

```java
public class MyEvent {

    private Integer id;

    @NotEmpty
    private String uqName;

    @NotNull @Min(0)
    private Integer value;

    @Email
    private String email;
}
```

밸리데이터는 주입 받아서 사용

```java
@Autowired
private Validator validator;

validator.validate(targetObject, errors);
```

## 2.3 Data binding

데이터 바인딩이란?
* 기술적: 값을 대상 객체에 설정하는 기능
* 도메인: 사용자의 입력을 도메인 모델에 동적으로 변환하는 기능

사용자의 입력 값을 적절한 변환을 거쳐 도메인 타입으로 넣는 기술

[DataBinder 참고](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/validation/DataBinder.html)

### 2.3.1 PropertyEditor

PropertyEditor는 스프링 스펙이 아니라 **자바빈즈 스펙**임.  
따라서 java.beans의 문서를 참고할 것!

다음과 같은 도메인이 있다.  

```java
@Data
@ToString
public class Book {

    private Integer id;

    private String title;

    public Book(Integer id) {
        this.id = id;
    }
}
```

이를 컨트롤러에서 사용한다.  

```java
@RestController
public class BookController {

    @GetMapping("/book/{book}")
    public String getBook(@PathVariable Book book) {
        System.out.println(book);
        return book.getId().toString();
    }
}
```

그리고 예상대로 터진다. 왜냐하면 문자열로 들어온 `{book}`을 도메인으로 변경할 방법을 스프링은 알 수가 없다.  
그렇다면 바인더를 만들어야지 '3'  

```java
public class BookEditor extends PropertyEditorSupport {

    @Override
    public String getAsText() {
        Book book = (Book) getValue();
        return book.getId().toString();
    }

    @Override
    public void setAsText(String text) throws IllegalArgumentException {
        setValue(new Book(Integer.parseInt(text)));
    }
}
```

이렇게 하면 이제 텍스트로 들어온 값을 Book 도메인의 ID에 맞게 변환해줄 것이다. 물론 등록도 해야한다.  

```java
@RestController
public class BookController {

    @InitBinder
    public void init(WebDataBinder webDataBinder) {
        webDataBinder.registerCustomEditor(Book.class, new BookEditor());
    }

    @GetMapping("/book/{book}")
    public String getBook(@PathVariable Book book) {
        System.out.println(book);
        return book.getId().toString();
    }
}
```

컨트롤러가 사용할 바인더를 등록했기 때문에 문제 없이 동작한다!  
하지만 문제가 있다 :(

* non `thread-safe`: 싱글톤으로 쓰면 망함 (상태를 저장하고 있기 때문)
* Object <-> String 변환만 지원
* 사용 방법이 번거로움

Spring 3 버전 대에 사용하던 것임.  

### 2.3.2 Converter & Formatter

이제 `PropertyEditor`가 아닌 `Converter`, `Formatter`를 사용해볼 것이다.  

(1) Converter

* S -> T의 타입 변환이 가능한 generic한 converter
* **`stateless`**
* `ConverterRegistry`를 통해 등록
* `Converter<S, T>`
  * S: source
  * T: target

[Converter 인터페이스 참고](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/core/convert/converter/Converter.html) 

우선 컨버터를 만들어보자.  

```java
public class BookConverter {


    public static class BookToStringConverter implements Converter<Book, String> {

        @Override
        public String convert(Book source) {
            return source.getId().toString();
        }
    }

    public static class StringToBookConverter implements Converter<String, Book> {

        @Override
        public Book convert(String source) {
            return new Book(Integer.parseInt(source));
        }
    }
}
```

컨버터를 등록하는 방법은 두 가지가 있다.  

* MVC를 사용하는 경우 WebConfig에서 등록
* 단순하게 컴포넌트로 등록(알아서 `ConversionService`에 등록됨)

WebConfig에 등록하는 경우

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new BookConverter.BookToStringConverter());
        registry.addConverter(new BookConverter.StringToBookConverter());
    }
}
```

빈으로 등록

```java
public class BookConverter {

    @Component
    public static class BookToStringConverter implements Converter<Book, String> {

        @Override
        public String convert(Book source) {
            return source.getId().toString();
        }
    }

    @Component
    public static class StringToBookConverter implements Converter<String, Book> {

        @Override
        public Book convert(String source) {
            return new Book(Integer.parseInt(source));
        }
    }
}
```

(2) Formatter

* `PropertyEditor` 대체
* Object <-> String 변환
* 다국화 제공
* `FormatterRegistry`에 등록

[Formatter 인터페이스 참고](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/format/Formatter.html)

`Formatter`를 작성해보자!

```java
public class BookFormatter implements Formatter<Book> {

    @Override
    public Book parse(String text, Locale locale) throws ParseException {
        return new Book(Integer.parseInt(text));
    }

    @Override
    public String print(Book object, Locale locale) {
        return object.getId().toString();
    }
}
```

등록 방법은 Converter와 동일, 하지만 테스트가 실패할 것임.

```java
@RunWith(SpringRunner.class)
@WebMvcTest({BookController.class, BookFormatter.class})
public class BookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void getTest() throws Exception {
        mockMvc.perform(get("/book/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("1"));
    }
}
```

`@WebMvcTest`에 등록해주면 됨.  

### 2.3.3 Converter Service

* 다양한 변환 제공
* Spring MVC, Bean, SpEL 등에서 사용
* **`thread-safe`**
* `DefaultFormattingConversionService` (구현체)
  * MVC에서는 이를 상속한 `WebConversionService` 사용
  * `Converter`, `Formatter` 구현체를 알아서 등록 해줌 (부트 한정)

# 3. SpEL (Spring Expression Language)

Spring EL
* Spring 3.0부터 지원


(1) raw하게 써보기

```java
ExpressionParser exprParser = new SpelExpressionParser();
StandardEvaluationContext ctx = new StandardEvaluationContext();
Expression expr = exprParser.parseExpression("1 gt 10");
String evaluated = expr.getValue(ctx, String.class);
System.out.println(evaluated);
```

과정 요약

1. Parser가 식(여기선 "1 gt 10")을 파싱해 AST로 만듬
2. AST를 평가(evaluate)함
3. 타입을 변환함
4. 짠 ㅇㅅㅇ

(2) 할 수 있는 것

* Literal Expressions
* Properties, Arrays, Lists, Maps, and Indexers
* Inline Lists
* Inline Maps
* Array Construction
* Methods
* Operators
* Types
* Constructors
* Variables
* Functions
* Bean References
* Ternary Operator (If-Then-Else)
* The Elvis Operator
* Safe Navigation Operator

많음. 사실상 언어라고 보면 됨. 따라서 [레퍼런스](https://docs.spring.io/spring/docs/current/spring-framework-reference/core.html#expressions-language-ref)를 보자.  

(3) 스프링에서 사용되는 곳

* Spring Data
* Spring Security
* Property loading
* Thymeleaf

# 4. AOP(Aspect Oriented Programming)

링크

* [AOP의 이해와 활용](https://hyeyoom.github.io/2019/03/17/AOP%EC%9D%98-%EC%9D%B4%ED%95%B4%EC%99%80-%ED%99%9C%EC%9A%A9/)
* [AOP 응용](https://hyeyoom.github.io/2019/03/16/How-to-log-all-client-ip-addresses-in-Spring/)