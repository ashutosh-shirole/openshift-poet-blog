Creating free personal blog website

{{{
  "title" : "Creating blog based website using openshift and node.js",
  "tags" : [ "node.js", "poet", "openshift" ],
  "category" : "web",
  "date" : "02-20-2014",
  "description" : "Step by step guid to create blog on openshift"
}}}

This blog describes step by step creation of blog styled website on openshift using node.js viz. poet, jade, markdown module.

<!--more-->


# Basic setup

## Requirements

* openshift account
* git
* ruby
* ruby gems

## openshift account

Create an account on [openshift](https://www.openshift.com). Its free for first three gears. This is enough for a simple personal blog application

## Set up your machine for web application

Follow the instructions [here](https://www.openshift.com/developers/rhc-client-tools-install) and install the rhc client. I will summarize the details for ubuntu OS.

<pre>
	$ sudo apt-get install ruby-full rubygems git-core
	$ sudo gem install rhc
	$ rhc setup
</pre>

After running `rhc setup` command enter your openshift account username and password when prompted. It will also ask you to add your ssh-public-private key to the account.

## Create the node app

If we create the app using instructions provided on openshift website we are restricted to use node.js version 0.6 or 0.10. To create app of a custom version of node.js follow steps provided by [Grant Shipley](https://www.openshift.com/blogs/any-version-of-nodejs-you-want-in-the-cloud-openshift-does-it-paas-style). I'll summarize them

<pre>
	$ rhc app create blog nodejs-0.6
	$ cd blog
	$ git remote add upstream -m master git://github.com/openshift/nodejs-custom-version-openshift.git
	$ git pull -s recursive -X theirs upstream master
	$ nano .openshift/markers/NODEJS_VERSION
</pre>

In this marker file change version to `0.9.1`.

## Changing default app to blog app

We will be configuring the app to use [Poet](https://github.com/jsantell/poet), [Jade](https://github.com/visionmedia/jade). 
1. package.json
Change the `package.json` file to have following dependencies.

<pre>
	"dependencies": {
	    "express": "*",
	    "jade": ">=1.1.5",
	    "poet": "=1.0.0rc3",
	    "request": ">= 2.16.6",
	    "html-to-text": ">= *",
	    "underscore": ">= *",
	    "async": ">= *"
	  }
</pre>

Also you can change the `name`, `author-name` etc. in the same file.

2. Create files and folders as described below

<pre>
blog
  |-->_posts
  		|--first.md	
  |-->views
  		|--index.jade
  		|--categories.jade
  |-->public
  		|-->js
  		|-->img
  		|-->css
  |--server.js
  |--package.json
  |--routes.js
</pre>

3. server.js

Add following line

<pre>
	var Poet = require('poet');
</pre>

after

<pre>
	var fs = require('fs');
</pre>

Change <pre>self.initializeServer</pre> method as follows so that it configures the app to use 'poet' and 'jade'

<pre>
	self.initializeServer = function() {
        self.createRoutes();
        self.app = express();
        
        var poet = Poet(self.app, {
        	  postsPerPage: 5,
        	  posts: __dirname + '/_posts',
        	  metaFormat: 'json',
        	});

        poet.watch().init();

        self.app.set('views', __dirname + '/views');
        self.app.set('view engine', 'jade');
        self.app.use(express.static(__dirname + '/public'));
        self.app.use(self.app.router);

        require('./routes')(self.app);
        console.log('routes set');       
    };
</pre>

4.routes.js
Add following routes in `routes.js` file

<pre>
	module.exports = function(app) {

	app.get('/', function(req, res) {
		res.render('index', {
			title : 'Ashutosh'
		});
	});

	app.get('/categories', function(req, res) {
		res.render('categories', {
			title : 'Categories * Ashutosh'
		});
	});

};
</pre>

5. views/index.jade

This file will display the posts present in `_posts` folder. These posts will be constructed in [markdown](http://daringfireball.net/projects/markdown/) format prefixed by front matter via YAML or [JSON](https://github.com/jsantell/node-json-front-matter).

The contents of `index.jade` will be as follows

<pre>
doctype html
html
  head
      title= 'Ashutosh'
      meta(name='description', content='Ashutosh')

    meta(charset='utf-8')
    link(rel='icon', type='image/png', href='/favicon.png')
    link(rel='stylesheet', href='/css/layout.css')
  body
    .wrap
      .container
        .content
          - var posts = getPosts(0,5)
  		  - var page  = 1
  		  - each post in posts
    		div.post
			  h1
			    a(href=post.url)
			      = post.title
			  span.date #{post.date.getMonth()+1}.#{post.date.getDate()}.#{post.date.getFullYear()}
			  div.post.content
			    != post.content
			  div.tags
			    - each tag in post.tags
			      a(href=tagUrl(tag))
			        span.label.label-info #{tag}

</pre>

6. views/categories.jade

This file displays the list of categories. The markup in this file would be as:

<pre>
doctype html
html
  head
      title= 'Ashutosh'
      meta(name='description', content='Ashutosh')

    meta(charset='utf-8')
    link(rel='icon', type='image/png', href='/favicon.png')
    link(rel='stylesheet', href='/css/layout.css')
  body
    .wrap
      .container
        .content
          h1 All Categories
			  ul
			    - each cat in getCategories()
			      li
			        a(href=categoryURL(cat)) #{cat}
</pre>

After all these changes in the app, our blog is ready to be published on openshift

## Commit and push

Use following git commands to commit and push the app to openshift

<pre>
	$ git commit . -m 'blog app'
	$ git push
</pre>

Tadaaa. Now the app is ready. All you have to do is in your browser click the following url.

<pre>
	http://blog-{yourNamespace}.rhcloud.com
</pre>

## Free Domains

You can also register for free domains (as I have my own.. This ones free !!!) Google it and you will get your free domain. Just keep in mind that choose a domain that allows you to change the CNAME record. 


## Change the domain name

Openshift also allows you to change/redirect/forward from your domain `www.myexample.com` to the one you created `blog-{yourNamespace}.rhcloud.com`.
All you have to do is from your domain forward it to `http://blog-{yourNamespace}.rhcloud.com` and run the following command on your console.

<pre>
	$ rhc alias add blog www.myexample.com
</pre>
